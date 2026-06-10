import connectToDatabase from "./db";
import { Model } from "mongoose";
import Service from "./models/Service";
import CaseStudy from "./models/CaseStudy";
import CaseStudyCMS from "./models/CaseStudyCMS";
import Home from "./models/Home";
import About from "./models/aboutus";
import Contact from "./models/Contact";
import Blog from "./models/Blog";
import BlogCMS from "./models/BlogCMS";



/**
 * Localizes a case study document based on the provided locale.
 */
export function localizeCaseStudy(cs: any, locale: string) {
  if (!cs) return null;
  const l = locale as 'en' | 'ar';
  
  const imageUrl = cs.image?.url || (typeof cs.image === 'string' ? cs.image : "");
  
  return {
    ...cs,
    image: imageUrl,
    title: cs.title?.[l] || cs.title?.en || "",
    tag: cs.tag?.[l] || cs.tag?.en || "",
    industry: cs.industry?.[l] || cs.industry?.en || "",
    clientType: cs.clientType?.[l] || cs.clientType?.en || "",
    location: cs.location?.[l] || cs.location?.en || "",
    duration: cs.duration?.[l] || cs.duration?.en || "",
    outcome: cs.outcome?.[l] || cs.outcome?.en || "",
    description: cs.description?.[l] || cs.description?.en || "",
    
    challengeSection: {
      badge: cs.challengeSection?.badge?.[l] || cs.challengeSection?.badge?.en || "",
      title: cs.challengeSection?.title?.[l] || cs.challengeSection?.title?.en || "",
      content: cs.challengeSection?.content?.[l] || cs.challengeSection?.content?.en || ""
    },
    
    approachSection: {
      badge: cs.approachSection?.badge?.[l] || cs.approachSection?.badge?.en || "",
      title: cs.approachSection?.title?.[l] || cs.approachSection?.title?.en || "",
      items: (cs.approachSection?.items || []).map((item: any) => ({
        title: item.title?.[l] || item.title?.en || "",
        description: item.description?.[l] || item.description?.en || ""
      }))
    },
    
    resultsSection: {
      badge: cs.resultsSection?.badge?.[l] || cs.resultsSection?.badge?.en || "",
      title: cs.resultsSection?.title?.[l] || cs.resultsSection?.title?.en || "",
      items: (cs.resultsSection?.items || []).map((item: any) => ({
        value: item.value?.[l] || item.value?.en || "",
        label: item.label?.[l] || item.label?.en || ""
      }))
    },
    
    deliverablesSection: {
      badge: cs.deliverablesSection?.badge?.[l] || cs.deliverablesSection?.badge?.en || "",
      title: cs.deliverablesSection?.title?.[l] || cs.deliverablesSection?.title?.en || "",
      items: (cs.deliverablesSection?.items || []).map((item: any) => 
        typeof item === 'string' ? item : (item[l] || item.en || "")
      )
    },
    
    services: (cs.services || []).map((s: any) => 
      typeof s === 'string' ? s : (s[l] || s.en || "")
    ),
    
    testimonial: cs.testimonial ? {
      quote: cs.testimonial.quote?.[l] || cs.testimonial.quote?.en || "",
      author: cs.testimonial.author?.[l] || cs.testimonial.author?.en || "",
      role: cs.testimonial.role?.[l] || cs.testimonial.role?.en || ""
    } : undefined,

    cta: cs.cta ? {
      title: cs.cta.title?.[l] || cs.cta.title?.en || "",
      description: cs.cta.description?.[l] || cs.cta.description?.en || "",
      ctaText: cs.cta.ctaText?.[l] || cs.cta.ctaText?.en || "",
      ctaLink: cs.cta.ctaLink || "",
      ctaText2: cs.cta.ctaText2?.[l] || cs.cta.ctaText2?.en || "",
      ctaLink2: cs.cta.ctaLink2 || ""
    } : undefined,

    relatedSection: cs.relatedSection ? {
      badge: cs.relatedSection.badge?.[l] || cs.relatedSection.badge?.en || "",
      title: cs.relatedSection.title?.[l] || cs.relatedSection.title?.en || ""
    } : undefined
  };
}

/**
 * Localizes a blog document based on the provided locale.
 */
function localizeBlog(blog: any, locale: string) {
  if (!blog) return null;
  const l = locale as 'en' | 'ar';
  
  const imageUrl = blog.image?.url || (typeof blog.image === 'string' ? blog.image : "");
  
  return {
    ...blog,
    image: imageUrl,
    title: blog.title?.[l] || blog.title?.en || blog.title || "",
    excerpt: blog.excerpt?.[l] || blog.excerpt?.en || blog.excerpt || "",
    category: blog.category?.[l] || blog.category?.en || blog.category || "",
    categoryId: blog.category?.en || blog.category || "",
    readTime: blog.readTime?.[l] || blog.readTime?.en || blog.readTime || "",
    author: blog.author?.[l] || blog.author?.en || blog.author || "BZNX Editorial",
    content: blog.contentSection?.content || blog.content || [],
    ctaSection: {
      badge: blog.ctaSection?.badge?.[l] || blog.ctaSection?.badge?.en || "",
      title: blog.ctaSection?.title?.[l] || blog.ctaSection?.title?.en || "",
      description: blog.ctaSection?.description?.[l] || blog.ctaSection?.description?.en || "",
      ctaText: blog.ctaSection?.ctaText?.[l] || blog.ctaSection?.ctaText?.en || "",
      ctaLink: blog.ctaSection?.ctaLink || "/contact",
      ctaText2: blog.ctaSection?.ctaText2?.[l] || blog.ctaSection?.ctaText2?.en || "",
      ctaLink2: blog.ctaSection?.ctaLink2 || ""
    }
  };
}

/**
 * Fetches the list of all blogs, sorted by creation date.
 */
export async function getBlogs(locale?: string) {
  try {
    await connectToDatabase();
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
    const serialized = JSON.parse(JSON.stringify(blogs));
    if (locale) {
      return serialized.map((b: any) => localizeBlog(b, locale));
    }
    return serialized;
  } catch (error) {
    console.error("[CMS ERROR] Failed to fetch blogs list:", error);
    return [];
  }
}

/**
 * Fetches layout data for the blog listing page.
 */
export async function getBlogCMS() {
  try {
    await connectToDatabase();
    const cmsItems = await BlogCMS.find({}).lean();
    const result: Record<string, any> = {};
    cmsItems.forEach((item: any) => {
      result[item.section] = item.content;
    });
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error("[CMS ERROR] Failed to fetch blog CMS layout:", error);
    return {};
  }
}

/**
 * Fetches a single blog by slug.
 */
export async function getBlogBySlug(slug: string, locale?: string) {
  try {
    await connectToDatabase();
    const blog = await Blog.findOne({ slug }).lean();
    if (!blog) return null;
    const serialized = JSON.parse(JSON.stringify(blog));
    if (locale) {
      return localizeBlog(serialized, locale);
    }
    return serialized;
  } catch (error) {
    console.error(`[CMS ERROR] Failed to fetch blog with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Fetches CMS sections from a given model and reduces them into a key-value object.
 * Uses .lean() for maximum performance and to avoid Mongoose document overhead.
 */
export async function getCMSData(model: Model<any>) {
  try {
    await connectToDatabase();
    const items = await model.find({}).lean();
    
    // Convert array of sections into an object
    const data = items.reduce((acc: any, curr: any) => {
      acc[curr.section] = curr.content;
      return acc;
    }, {});

    // Ensure data is a plain object for Next.js props (serializes ObjectIds and Dates)
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error(`[CMS ERROR] Failed to fetch data for ${model.modelName}:`, error);
    return {};
  }
}

/**
 * Fetches related blogs based on category. Fallbacks to latest blogs if not enough found.
 */
export async function getRelatedBlogs(slug: string, category: string, locale: string, limit = 2) {
  try {
    await connectToDatabase();
    
    // 1. Try to find blogs in the same category
    let blogs = await (Blog as any).find({
      slug: { $ne: slug },
      $or: [
        { "category.en": category },
        { "category.ar": category }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
    
    // 2. If not enough blogs found, fill with latest blogs
    if (blogs.length < limit) {
      const existingIds = blogs.map((b: any) => b._id);
      const additionalBlogs = await (Blog as any).find({
        slug: { $ne: slug },
        _id: { $nin: existingIds }
      })
      .sort({ createdAt: -1 })
      .limit(limit - blogs.length)
      .lean();
      
      blogs = [...blogs, ...additionalBlogs];
    }
    
    const serialized = JSON.parse(JSON.stringify(blogs));
    return serialized.map((b: any) => localizeBlog(b, locale));
  } catch (error) {
    console.error("[CMS ERROR] Failed to fetch related blogs:", error);
    return [];
  }
}

/**
 * Fetches the list of all services, sorted by creation date.
 */
export async function getServices() {
  try {
    await connectToDatabase();
    const services = await Service.find({}).sort({ createdAt: 1 }).lean();
    
    // Ensure data is a plain object for Next.js props
    return JSON.parse(JSON.stringify(services));
  } catch (error) {
    console.error("[CMS ERROR] Failed to fetch services list:", error);
  }
}

/**
 * Fetches the list of all case studies, sorted by creation date.
 */
export async function getCaseStudies(locale?: string) {
  try {
    await connectToDatabase();
    const items = await CaseStudy.find({}).sort({ createdAt: 1 }).lean();
    const serialized = JSON.parse(JSON.stringify(items));
    if (locale) {
      return serialized.map((item: any) => localizeCaseStudy(item, locale));
    }
    return serialized;
  } catch (error) {
    console.error("[CMS ERROR] Failed to fetch case studies list:", error);
    return [];
  }
}

/**
 * Fetches a single case study by slug.
 */
export async function getCaseStudyBySlug(slug: string, locale?: string) {
  try {
    await connectToDatabase();
    const item = await CaseStudy.findOne({ slug }).lean();
    if (!item) return null;
    const serialized = JSON.parse(JSON.stringify(item));
    if (locale) {
      return localizeCaseStudy(serialized, locale);
    }
    return serialized;
  } catch (error) {
    console.error(`[CMS ERROR] Failed to fetch case study with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Fetches the Case Study CMS data (listing & detail headings).
 */
export async function getCaseStudyCMS() {
  return getCMSData(CaseStudyCMS);
}

/**
 * Fetches the Home CMS data.
 */
export async function getHomeCMS() {
  return getCMSData(Home);
}

/**
 * Fetches the About Us CMS data.
 */
export async function getAboutCMS() {
  return getCMSData(About);
}

/**
 * Fetches the Contact CMS data.
 */
export async function getContactCMS() {
  return getCMSData(Contact);
}
