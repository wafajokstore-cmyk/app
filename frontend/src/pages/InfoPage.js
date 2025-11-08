import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function InfoPage({ slug }) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPage();
    }
  }, [slug]);

  const fetchPage = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/pages/${slug}`);
      setPage(response.data);
    } catch (error) {
      console.error('Failed to fetch page:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="spinner" />
        </div>
      </Layout>
    );
  }

  if (!page) {
    return (
      <Layout>
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Page not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8" data-testid="page-title">{page.title}</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{page.content}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}