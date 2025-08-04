import { deletePage, togglePublish } from "../../actions/blogActions";


// export function usePageActions(setPages: (fn: (pages: any[]) => any[]) => void, updateLoadingState: Function) {
//   const handlePublish = async (slug: string) => {
//     updateLoadingState(slug, 'publish', true);
//     try {
//       await togglePublish(slug,);
//       setPages(prevPages =>
//         prevPages.map(page => (page.slug === slug ? { ...page, isPublished: !page.isPublished } : page))
//       );
//     } catch (error) {
//       console.error("Failed to toggle publish:", error);
//     } finally {
//       updateLoadingState(slug, 'publish', false);
//     }
//   };

//   const handleDelete = async (domain: string, slug: string) => {
//     if (!window.confirm("Are you sure you want to delete this page? This action cannot be undone.")) return;
//     updateLoadingState(slug, 'delete', true);
//     try {
//       await deletePage(domain, slug);
//       setPages(prevPages => prevPages.filter(page => page.slug !== slug));
//     } catch (error) {
//       console.error("Failed to delete page:", error);
//     } finally {
//       updateLoadingState(slug, 'delete', false);
//     }
//   };

//   return { handlePublish, handleDelete };
// }
