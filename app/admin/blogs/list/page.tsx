"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { Button } from "@mui/material";
import { Plus } from "lucide-react";
import DeleteConfirmModal from "@/components/admin/common/DeleteConfirmModal";
import Image from "next/image";

export default function BlogListPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      const result = await res.json();
      if (result.status) setBlogs(result.data);
    } catch (error) {
      enqueueSnackbar("Error fetching blogs", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/blogs?id=${deleteId}`, { method: "DELETE" });
      const result = await res.json();
      if (result.status) {
        enqueueSnackbar("Blog deleted successfully", { variant: "success" });
        setBlogs(blogs.filter(s => s._id !== deleteId));
      } else {
        enqueueSnackbar("Failed to delete blog", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Error deleting blog", { variant: "error" });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };
  return (
    <SnackbarProvider maxSnack={3}>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#091d37] uppercase tracking-tighter">Blogs</h1>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Manage your blog posts</p>
          </div>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => router.push("/admin/blogs/manage")}
            sx={{ bgcolor: '#00C4B4', borderRadius: '12px', px: 4, py: 1.5, fontWeight: 800, '&:hover': { bgcolor: '#00A396' } }}
          >
            New Blog Post
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#00C4B4] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg font-bold">
              No blog posts found.
            </p>
            <p className="text-sm mt-2">
              Click "New Blog Post" to add one.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="relative bg-white rounded-3xl overflow-hidden border border-slate-100 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl group flex flex-col">


                <div className="relative overflow-hidden flex-shrink-0 h-52">
                  <Image
                    src={blog.image?.url}
                    alt={blog.title?.en || "Blog"}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-[#091d37]/40 group-hover:bg-[#091d37]/30 transition-colors duration-300" />

                  {/* Category badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full backdrop-blur-sm"
                      style={{
                        backgroundColor: "#26D0CE25",
                        color: "#26D0CE",
                        border: "1px solid #26D0CE50",
                      }}
                    >
                      {blog.category?.en || "Uncategorized"}
                    </span>
                  </div>

                  {/* Featured badge */}
                  {blog.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-black tracking-[0.15em] uppercase px-3 py-1.5 rounded-full backdrop-blur-sm"
                        style={{
                          backgroundColor: "rgba(114, 112, 106, 1)",
                          color: "#ffffffff",
                          border: "1px solid rgba(114, 112, 106, 1)",
                        }}
                      >
                        Featured
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 z-10">
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3
                    className="font-bold leading-snug mb-3 text-lg"
                    style={{ color: "#1A2B5A" }}
                  >
                    {blog.title?.en || "Untitled Blog"}
                  </h3>

                  <p className="text-slate-500 text-sm leading-relaxed flex-1 line-clamp-3">
                    {blog.excerpt?.en || "No excerpt available."}
                  </p>

                  <div className="mt-6 flex gap-2">
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() =>
                        router.push(`/admin/blogs/manage/${blog._id}`)
                      }
                      sx={{
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 700,
                        borderColor: "#00C4B4",
                        color: "#00C4B4",
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      fullWidth
                      color="error"
                      variant="outlined"
                      onClick={() => setDeleteId(blog._id)}
                      sx={{
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <DeleteConfirmModal
          open={!!deleteId}
          loading={deleting}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Delete Blog"
          message="Are you sure you want to delete this blog post? This action will remove all its content and cannot be undone."
        />
      </div>
    </SnackbarProvider>
  );
}
