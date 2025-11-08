import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { toast } from 'sonner';
import { LogOut, Plus, Pencil, Trash2, Video, Folder, Palette, Upload } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Admin() {
  const { t } = useLanguage();
  const { colors, updateColors, updateLogo } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Video form
  const [videoForm, setVideoForm] = useState({
    id: '',
    title: '',
    description: '',
    embedUrl: '',
    thumbnail: '',
    category: '',
    episode: ''
  });
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  
  // Category form
  const [categoryForm, setCategoryForm] = useState({ id: '', name: '', slug: '' });
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  
  // Theme form
  const [themeForm, setThemeForm] = useState(colors);
  const [logoInput, setLogoInput] = useState('');

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchVideos();
      fetchCategories();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setThemeForm(colors);
  }, [colors]);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${API}/videos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('adminToken');
      setToken('');
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/admin/login`, { password });
      const newToken = response.data.token;
      setToken(newToken);
      localStorage.setItem('adminToken', newToken);
      setIsAuthenticated(true);
      toast.success('Login successful');
    } catch (error) {
      toast.error('Invalid password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setIsAuthenticated(false);
    toast.success('Logged out');
  };

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/videos?limit=100`);
      setVideos(response.data);
    } catch (error) {
      toast.error('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditingVideo) {
        await axios.put(`${API}/videos/${videoForm.id}`, videoForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Video updated');
      } else {
        await axios.post(`${API}/videos`, videoForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Video created');
      }
      setVideoDialogOpen(false);
      resetVideoForm();
      fetchVideos();
    } catch (error) {
      toast.error('Failed to save video');
    }
  };

  const handleDeleteVideo = async (id) => {
    try {
      await axios.delete(`${API}/videos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Video deleted');
      fetchVideos();
    } catch (error) {
      toast.error('Failed to delete video');
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditingCategory) {
        await axios.put(`${API}/categories/${categoryForm.id}`, categoryForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Category updated');
      } else {
        await axios.post(`${API}/categories`, categoryForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Category created');
      }
      setCategoryDialogOpen(false);
      resetCategoryForm();
      fetchCategories();
    } catch (error) {
      toast.error('Failed to save category');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`${API}/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const handleThemeUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/settings`, themeForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      updateColors(themeForm);
      toast.success('Theme updated');
    } catch (error) {
      toast.error('Failed to update theme');
    }
  };

  const handleLogoUpload = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/settings`, { logo: logoInput }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      updateLogo(logoInput);
      toast.success('Logo updated');
      setLogoInput('');
    } catch (error) {
      toast.error('Failed to update logo');
    }
  };

  const resetToDefault = async () => {
    const defaultColors = {
      primaryColor: '#3B82F6',
      darkBg: '#0F0F0F',
      lightBg: '#FFFFFF',
      textColor: '#E5E7EB'
    };
    setThemeForm(defaultColors);
    try {
      await axios.put(`${API}/settings`, defaultColors, {
        headers: { Authorization: `Bearer ${token}` }
      });
      updateColors(defaultColors);
      toast.success('Reset to default');
    } catch (error) {
      toast.error('Failed to reset');
    }
  };

  const resetVideoForm = () => {
    setVideoForm({ id: '', title: '', description: '', embedUrl: '', thumbnail: '', category: '', episode: '' });
    setIsEditingVideo(false);
  };

  const resetCategoryForm = () => {
    setCategoryForm({ id: '', name: '', slug: '' });
    setIsEditingCategory(false);
  };

  const openVideoDialog = (video = null) => {
    if (video) {
      setVideoForm(video);
      setIsEditingVideo(true);
    } else {
      resetVideoForm();
    }
    setVideoDialogOpen(true);
  };

  const openCategoryDialog = (category = null) => {
    if (category) {
      setCategoryForm(category);
      setIsEditingCategory(true);
    } else {
      resetCategoryForm();
    }
    setCategoryDialogOpen(true);
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertImageToBase64(file);
        if (field === 'thumbnail') {
          setVideoForm({ ...videoForm, thumbnail: base64 });
        } else if (field === 'logo') {
          setLogoInput(base64);
        }
      } catch (error) {
        toast.error('Failed to process image');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center">{t('admin')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="password">{t('password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    data-testid="admin-password-input"
                  />
                </div>
                <Button type="submit" className="w-full" data-testid="admin-login-btn">
                  {t('login')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" data-testid="admin-title">{t('admin')}</h1>
          <Button onClick={handleLogout} variant="outline" className="gap-2" data-testid="logout-btn">
            <LogOut className="h-4 w-4" />
            {t('logout')}
          </Button>
        </div>

        <Tabs defaultValue="videos" className="space-y-6">
          <TabsList>
            <TabsTrigger value="videos" data-testid="tab-videos">
              <Video className="h-4 w-4 mr-2" />
              {t('manageVideos')}
            </TabsTrigger>
            <TabsTrigger value="categories" data-testid="tab-categories">
              <Folder className="h-4 w-4 mr-2" />
              {t('manageCategories')}
            </TabsTrigger>
            <TabsTrigger value="theme" data-testid="tab-theme">
              <Palette className="h-4 w-4 mr-2" />
              {t('themeSettings')}
            </TabsTrigger>
          </TabsList>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Videos ({videos.length})</h2>
              <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => openVideoDialog()} className="gap-2" data-testid="add-video-btn">
                    <Plus className="h-4 w-4" />
                    {t('addVideo')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{isEditingVideo ? t('editVideo') : t('addVideo')}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleVideoSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">{t('title')}</Label>
                      <Input
                        id="title"
                        value={videoForm.title}
                        onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                        required
                        data-testid="video-title-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">{t('description')}</Label>
                      <Textarea
                        id="description"
                        value={videoForm.description}
                        onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                        required
                        rows={3}
                        data-testid="video-description-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="embedUrl">{t('embedUrl')}</Label>
                      <Input
                        id="embedUrl"
                        value={videoForm.embedUrl}
                        onChange={(e) => setVideoForm({ ...videoForm, embedUrl: e.target.value })}
                        required
                        placeholder="https://example.com/embed/video-id"
                        data-testid="video-embed-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="thumbnail">{t('thumbnail')} (Base64 or URL)</Label>
                      <Input
                        id="thumbnail"
                        value={videoForm.thumbnail}
                        onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                        placeholder="Paste URL or upload image"
                        data-testid="video-thumbnail-input"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'thumbnail')}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">{t('category')}</Label>
                      <Input
                        id="category"
                        value={videoForm.category}
                        onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                        required
                        data-testid="video-category-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="episode">{t('episode')} (Optional)</Label>
                      <Input
                        id="episode"
                        value={videoForm.episode}
                        onChange={(e) => setVideoForm({ ...videoForm, episode: e.target.value })}
                        data-testid="video-episode-input"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" data-testid="video-save-btn">{t('save')}</Button>
                      <Button type="button" variant="outline" onClick={() => setVideoDialogOpen(false)}>
                        {t('cancel')}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {videos.map((video) => (
                <Card key={video.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    {video.thumbnail && (
                      <img src={video.thumbnail} alt={video.title} className="w-32 h-20 object-cover rounded" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{video.title}</h3>
                      <p className="text-sm text-gray-500">{video.category} {video.episode && `- Ep ${video.episode}`}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openVideoDialog(video)}
                        data-testid={`edit-video-${video.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive" data-testid={`delete-video-${video.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Video?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteVideo(video.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Categories ({categories.length})</h2>
              <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => openCategoryDialog()} className="gap-2" data-testid="add-category-btn">
                    <Plus className="h-4 w-4" />
                    {t('addCategory')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isEditingCategory ? 'Edit Category' : t('addCategory')}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">{t('categoryName')}</Label>
                      <Input
                        id="name"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        required
                        data-testid="category-name-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">{t('categorySlug')}</Label>
                      <Input
                        id="slug"
                        value={categoryForm.slug}
                        onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                        required
                        placeholder="doraemon"
                        data-testid="category-slug-input"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" data-testid="category-save-btn">{t('save')}</Button>
                      <Button type="button" variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                        {t('cancel')}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openCategoryDialog(category)}
                        data-testid={`edit-category-${category.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive" data-testid={`delete-category-${category.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Theme Tab */}
          <TabsContent value="theme" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('uploadLogo')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogoUpload} className="space-y-4">
                  <div>
                    <Label htmlFor="logo">Logo (Base64 or URL)</Label>
                    <Input
                      id="logo"
                      value={logoInput}
                      onChange={(e) => setLogoInput(e.target.value)}
                      placeholder="Paste URL or upload image"
                      data-testid="logo-input"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logo')}
                      className="mt-2"
                    />
                  </div>
                  <Button type="submit" data-testid="logo-save-btn">
                    <Upload className="h-4 w-4 mr-2" />
                    {t('save')}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('themeSettings')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleThemeUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryColor">{t('primaryColor')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={themeForm.primaryColor}
                          onChange={(e) => setThemeForm({ ...themeForm, primaryColor: e.target.value })}
                          className="w-20 h-10"
                          data-testid="primary-color-input"
                        />
                        <Input
                          value={themeForm.primaryColor}
                          onChange={(e) => setThemeForm({ ...themeForm, primaryColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="darkBg">{t('darkBackground')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="darkBg"
                          type="color"
                          value={themeForm.darkBg}
                          onChange={(e) => setThemeForm({ ...themeForm, darkBg: e.target.value })}
                          className="w-20 h-10"
                          data-testid="dark-bg-input"
                        />
                        <Input
                          value={themeForm.darkBg}
                          onChange={(e) => setThemeForm({ ...themeForm, darkBg: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lightBg">{t('lightBackground')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="lightBg"
                          type="color"
                          value={themeForm.lightBg}
                          onChange={(e) => setThemeForm({ ...themeForm, lightBg: e.target.value })}
                          className="w-20 h-10"
                          data-testid="light-bg-input"
                        />
                        <Input
                          value={themeForm.lightBg}
                          onChange={(e) => setThemeForm({ ...themeForm, lightBg: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="textColor">{t('textColor')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="textColor"
                          type="color"
                          value={themeForm.textColor}
                          onChange={(e) => setThemeForm({ ...themeForm, textColor: e.target.value })}
                          className="w-20 h-10"
                          data-testid="text-color-input"
                        />
                        <Input
                          value={themeForm.textColor}
                          onChange={(e) => setThemeForm({ ...themeForm, textColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" data-testid="theme-save-btn">{t('save')}</Button>
                    <Button type="button" variant="outline" onClick={resetToDefault} data-testid="theme-reset-btn">
                      {t('resetToDefault')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}