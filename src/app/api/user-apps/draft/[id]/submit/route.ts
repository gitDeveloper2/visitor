import { NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const draftId = params.id;
    if (!ObjectId.isValid(draftId)) {
      return NextResponse.json({ message: 'Invalid draft ID format' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Load draft and validate ownership
    const draft: any = await db.collection('app_drafts').findOne({
      _id: new ObjectId(draftId),
      userId: session.user.id,
    });

    if (!draft) {
      return NextResponse.json({ message: 'App draft not found' }, { status: 404 });
    }

    // If the draft is intended to be premium, require premium readiness (webhook-confirmed)
    const isPremiumRequested = draft.premiumPlan === 'premium' || draft.pricing === 'Premium';
    if (isPremiumRequested && !draft.premiumReady) {
      return NextResponse.json({ message: 'Payment not completed. Please finish payment or retry.' }, { status: 400 });
    }

    // Generate a unique slug from the name (same logic as creation route)
    let slug = String(draft.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    let counter = 1;
    const originalSlug = slug;
    while (await db.collection('userapps').findOne({ slug })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    const now = new Date();

    // Build app document (align fields with /api/user-apps creation route)
    const newApp = {
      name: draft.name,
      description: draft.description,
      tagline: draft.tagline || (draft.description ? String(draft.description).slice(0, 100) : ''),
      fullDescription: draft.fullDescription || draft.description || '',
      tags: Array.isArray(draft.tags) ? draft.tags : [],
      authorId: session.user.id,
      authorName: session.user.name,
      authorEmail: session.user.email,
      authorBio: draft.authorBio || '',
      authorAvatar: session.user.image || null,
      isInternal: !!draft.isInternal,
      website: draft.website || '',
      github: draft.github || '',
      category: draft.category || 'Other',
      techStack: Array.isArray(draft.techStack) ? draft.techStack : [],
      pricing: draft.pricing || 'Free',
      features: Array.isArray(draft.features) ? draft.features : [],
      slug,
      externalUrl: draft.website || null,
      views: 0,
      likes: 0,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      premiumPlan: draft.premiumPlan || null,
      isPremium: false, // premium activation handled by webhook only
      premiumStatus: draft.premiumPlan === 'premium' ? 'pending' : 'none',
      premiumRequestedAt: draft.premiumPlan === 'premium' ? now : null,
    } as any;

    const insertResult = await db.collection('userapps').insertOne(newApp);

    // Delete draft after successful promotion
    await db.collection('app_drafts').deleteOne({ _id: new ObjectId(draftId), userId: session.user.id });

    return NextResponse.json(
      {
        message: 'Draft submitted successfully. Your app is pending review.',
        app: { _id: insertResult.insertedId, ...newApp },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting app draft:', error);
    return NextResponse.json(
      { message: 'Failed to submit app draft.', error: (error as Error)?.toString() },
      { status: 500 }
    );
  }
}

