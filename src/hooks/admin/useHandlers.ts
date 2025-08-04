import { useEffect, useState } from "react";
import { deletePage, getAllPages, togglePublish } from "../../actions/blogActions";
import { metadata } from "../../app/layout";
import { useRouter } from "next/router";

export   const usePagesHandlers=({content}:{content:string})=>{
    const [isIndexing, setIsIndexing] = useState(false);
    const [isIndexingCategory, setIsIndexingCategory] = useState(false);
    const [pageStats, setPageStats] = useState([]);
    const [pages, setPages] = useState<any[]>([]);
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: { publish: boolean; delete: boolean; edit: boolean; revalidate: boolean } }>({});
    const [isGeneratingStats, setIsGeneratingStats] = useState(false);
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPage,setSelectedPage]=useState(null)
    const [isModalOpen,setModalOpen ]=useState(false)
    const [isShareModalOpen,setShareModalOpen ]=useState(false)
    useEffect(() => {
      fetchPages();
    }, [content]);
    
    async function fetchPages() {
      setLoading(true);
      setError(null);
      try {
        const pagesData = await getAllPages(content);
        setPages(pagesData);
      } catch (error) {
        console.error("Failed to fetch pages:", error);
        setError("Failed to load pages");
      } finally {
        setLoading(false);
      }
    }
   
    const handleToggleShareModal=()=>{
   
      setShareModalOpen((prev)=>!prev)
    }
    

    const handleCloseModal=()=>{
      setModalOpen(false)
    }
    useEffect(() => {
       
        fetchStats();
      }, [refreshFlag]);
      useEffect(() => {
        
        
        fetchPages();
      }, []);


      
    const fetchStats = async () => {
        const res = await fetch(`/api/stats`);
        const data = await res.json();
         
        setPageStats(data.stats);
      };

      const handleEditMetadata=(page)=>{
       
        setSelectedPage(page)
        setModalOpen(true)
      }

    const handleIndex = async () => {
        setIsIndexing(true);
        try {
          
          const res = await fetch('/api/index', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ path: '' }),
          });
      
        } catch (error) {
          console.error("Failed to index pages:", error);
        } finally {
          setIsIndexing(false);
        }
      };

      const handleCategoryIndex=async()=>{
        setIsIndexing(true)
        const response=await fetch("/api/index-categories",{method:"GET"})
           setIsIndexing(false)  

      }

      const handleRecalculate = async (slug: string) => {
        await fetch(`/api/recalculate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });
        fetchStats();
      };

      const handlePublish = async (slug: string) => {
        setLoadingStates((prev) => ({
          ...prev,
          [slug]: { ...prev[slug], publish: true },
        }));
        try {
          await togglePublish(slug,content);
          setPages((prevPages) =>
            prevPages.map((page) =>
              page.slug === slug ? { ...page, isPublished: !page.isPublished } : page
            )
          );
        } catch (error) {
          console.error("Failed to toggle publish:", error);
        } finally {
          setLoadingStates((prev) => ({
            ...prev,
            [slug]: { ...prev[slug], publish: false },
          }));
        }
      };

      const handleDelete = async (domain: string, slug: string) => {
        const confirmed = window.confirm(
          "Are you sure you want to delete this page? This action cannot be undone."
        );
    
        if (!confirmed) return;
        setLoadingStates((prev) => ({
          ...prev,
          [slug]: { ...prev[slug], delete: true },
        }));
        try {
          await deletePage(domain, slug,content);
          setPages((prevPages) => prevPages.filter((page) => page.slug !== slug));
        } catch (error) {
          console.error("Failed to delete page:", error);
        } finally {
          setLoadingStates((prev) => ({
            ...prev,
            [slug]: { ...prev[slug], delete: false },
          }));
        }
      };
      const handleRevalidate = async (domain: string, slug: string) => {
        const path=content=="blog"?"learn":"news"
        setLoadingStates((prev) => ({
          ...prev,
          [slug]: { ...prev[slug], revalidate: true },
        }));
    
        try {
          await fetch("/api/revalidate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ path: `/${path}/${domain}/${slug}` }), // Send the full path here
          });
        } catch (error) {
          console.error("Failed to revalidate page:", error);
        } finally {
          setLoadingStates((prev) => ({
            ...prev,
            [slug]: { ...prev[slug], revalidate: false },
          }));
        }
      };
      const handleRedirectToPage = (domain: string, slug: string) => {
        const path=content=="blog"?"learn":"news"

        return `/${path}/${domain}/${slug}`;
      };

      const handleGenerateAllStats = async () => {
        setIsGeneratingStats(true);
        try {
          const res = await fetch(`/api/stats`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();
          if (data.success) {
            // Set the refresh flag to trigger refetch
            setRefreshFlag((prev) => !prev);
          }
        } catch (error) {
          console.error("Failed to generate all stats:", error);
        } finally {
          setIsGeneratingStats(false);
        }
      };

      return{

        pages:{
            pages,
            setPages,
            loading,
            error
        },
        indexing:{
            handleIndex
            ,isIndexing
            ,handleCategoryIndex
            ,isIndexingCategory
        },
        loading:{
            loadingStates
        },
        recalculate:{
            handleRecalculate
        },
        publish:{
            handlePublish
        },
        delete:{
            handleDelete
        },
        revalidate:{
handleRevalidate
        },
        redirect:{
            handleRedirectToPage
        },
        share:{
          handleToggleShareModal,
          isShareModalOpen
        },
        metadata:{
          selectedPage,
          isModalOpen,
          handleCloseModal,
          handleEditMetadata
        },
        stats:{
            pageStats,
            isGeneratingStats,
            handleGenerateAllStats
        }
      }
}

// export 