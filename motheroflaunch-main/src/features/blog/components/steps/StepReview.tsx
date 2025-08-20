'use client';


import { Button } from '@mui/material';

export default function StepReview({
  data,
  onBack,
  onSubmit,
}: {
  data: any ;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold">Review Your Post</h2>

      {/* Cover Image */}
      {data.coverImage?.url && (
        <img
          src={data.coverImage.url}
          alt="Cover"
          className="rounded-lg w-full max-h-96 object-cover"
        />
      )}

      {/* Title + Excerpt */}
      <div>
        <h1 className="text-3xl font-bold">{data.title}</h1>
        {data.excerpt && (
          <p className="text-muted-foreground mt-2">{data.excerpt}</p>
        )}
      </div>

      {/* Tags and Tool */}
      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
        {data.tool && (
          <span className="px-2 py-1 bg-gray-100 rounded">Linked Tool</span>
        )}
        {data.tags?.map((tag) => (
          <span key={tag} className="px-2 py-1 bg-gray-100 rounded">
            #{tag}
          </span>
        ))}
      </div>

      {/* Placeholder for Content Preview */}
      <div className="border rounded p-4 bg-white shadow text-gray-500 italic">
        Content will be included as written — not shown here.
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-8">
        <Button onClick={onBack}>← Back</Button>
        <Button variant="contained" color="primary" onClick={onSubmit}>
          Publish
        </Button>
      </div>
    </div>
  );
}
