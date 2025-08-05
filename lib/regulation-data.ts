import { createClient } from "@sanity/client";

// Create Sanity client
const sanityClient = process.env.SANITY_PROJECT_ID ? createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: "2024-01-01",
}) : null;

// Helper function to ensure client exists
function getClient() {
  if (!sanityClient) {
    throw new Error('Sanity client not configured. Please check environment variables.');
  }
  return sanityClient;
}

// Sanity schema types for regulation data
export interface RegulationArticle {
  _id?: string;
  _type: 'regulationArticle';
  title: string;
  slug: {
    current: string;
  };
  body: any[]; // Portable text
  category: 'safety' | 'labor-law' | 'environmental' | 'licensing';
  region: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  published: boolean;
}

export interface ComplianceTip {
  _id?: string;
  _type: 'complianceTip';
  title: string;
  description: string;
  aiGenerated: boolean;
  approved: boolean;
  category: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface DocumentAnalysis {
  _id?: string;
  _type: 'documentAnalysis';
  fileName: string;
  summary: string;
  keyPoints: string[];
  checklist: string[];
  uploadedBy: string;
  createdAt: string;
  approved: boolean;
  approvedBy?: string;
}

export interface RegulationFAQ {
  _id?: string;
  _type: 'regulationFAQ';
  question: string;
  answer: string;
  aiGenerated: boolean;
  approved: boolean;
  category: string;
  createdAt: string;
  approvedBy?: string;
  views: number;
}

// CRUD operations for Regulation Articles
export const regulationArticleService = {
  async getAll(filters?: {
    category?: string;
    region?: string;
    published?: boolean;
  }) {
    let query = '*[_type == "regulationArticle"';
    
    if (filters?.category) {
      query += ` && category == "${filters.category}"`;
    }
    if (filters?.region) {
      query += ` && region match "*${filters.region}*"`;
    }
    if (filters?.published !== undefined) {
      query += ` && published == ${filters.published}`;
    }
    
    query += '] | order(createdAt desc)';
    
    return await getClient().fetch(query);
  },

  async getBySlug(slug: string) {
    return await getClient().fetch(
      '*[_type == "regulationArticle" && slug.current == $slug][0]',
      { slug }
    );
  },

  async create(data: Omit<RegulationArticle, '_id' | '_type' | 'createdAt'>) {
    return await getClient().create({
      _type: 'regulationArticle',
      ...data,
      createdAt: new Date().toISOString(),
    });
  },

  async update(id: string, data: Partial<RegulationArticle>) {
    return await getClient().patch(id).set({
      ...data,
      updatedAt: new Date().toISOString(),
    }).commit();
  },

  async delete(id: string) {
    return await getClient().delete(id);
  },

  async search(searchTerm: string) {
    return await getClient().fetch(
      '*[_type == "regulationArticle" && (title match "*" + $searchTerm + "*" || pt::text(body) match "*" + $searchTerm + "*")] | order(createdAt desc)',
      { searchTerm }
    );
  }
};

// CRUD operations for Compliance Tips
export const complianceTipService = {
  async getAll(approved?: boolean) {
    const query = approved !== undefined 
      ? '*[_type == "complianceTip" && approved == $approved] | order(createdAt desc)'
      : '*[_type == "complianceTip"] | order(createdAt desc)';
    
    return await getClient().fetch(query, { approved });
  },

  async create(data: Omit<ComplianceTip, '_id' | '_type' | 'createdAt'>) {
    return await getClient().create({
      _type: 'complianceTip',
      ...data,
      createdAt: new Date().toISOString(),
    });
  },

  async approve(id: string, approvedBy: string) {
    return await getClient().patch(id).set({
      approved: true,
      approvedBy,
      approvedAt: new Date().toISOString(),
    }).commit();
  },

  async reject(id: string) {
    return await getClient().delete(id);
  }
};

// CRUD operations for Document Analysis
export const documentAnalysisService = {
  async getAll(approved?: boolean) {
    const query = approved !== undefined
      ? '*[_type == "documentAnalysis" && approved == $approved] | order(createdAt desc)'
      : '*[_type == "documentAnalysis"] | order(createdAt desc)';
    
    return await getClient().fetch(query, { approved });
  },

  async create(data: Omit<DocumentAnalysis, '_id' | '_type' | 'createdAt' | 'approved'>) {
    return await getClient().create({
      _type: 'documentAnalysis',
      ...data,
      createdAt: new Date().toISOString(),
      approved: false,
    });
  },

  async approve(id: string, approvedBy: string) {
    return await getClient().patch(id).set({
      approved: true,
      approvedBy,
    }).commit();
  },

  async delete(id: string) {
    return await getClient().delete(id);
  }
};

// CRUD operations for Regulation FAQs
export const regulationFAQService = {
  async getAll(approved?: boolean) {
    const query = approved !== undefined
      ? '*[_type == "regulationFAQ" && approved == $approved] | order(views desc, createdAt desc)'
      : '*[_type == "regulationFAQ"] | order(createdAt desc)';
    
    return await getClient().fetch(query, { approved });
  },

  async create(data: Omit<RegulationFAQ, '_id' | '_type' | 'createdAt' | 'views'>) {
    return await getClient().create({
      _type: 'regulationFAQ',
      ...data,
      createdAt: new Date().toISOString(),
      views: 0,
    });
  },

  async approve(id: string, approvedBy: string) {
    return await getClient().patch(id).set({
      approved: true,
      approvedBy,
    }).commit();
  },

  async incrementViews(id: string) {
    return await getClient().patch(id).inc({ views: 1 }).commit();
  },

  async delete(id: string) {
    return await getClient().delete(id);
  }
};
