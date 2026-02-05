import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { updateListing } from 'wasp/client/operations';
import { useQuery } from 'wasp/client/operations';
import { getCategories, getBook } from 'wasp/client/operations';
import { Button } from '../client/components/ui/button';
import { useScript } from '../client/contexts/ScriptContext';

const BOOK_CONDITIONS = [
  { value: 'NEW', label: 'conditionNew' },
  { value: 'LIKE_NEW', label: 'conditionLikeNew' },
  { value: 'VERY_GOOD', label: 'conditionVeryGood' },
  { value: 'GOOD', label: 'conditionGood' },
  { value: 'ACCEPTABLE', label: 'conditionAcceptable' },
] as const;

export default function EditListingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { script } = useScript();
  const { data: categories } = useQuery(getCategories);
  const { data: book, isLoading: bookLoading } = useQuery(getBook, { id: id! }, { enabled: !!id });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    condition: 'NEW' as 'NEW' | 'LIKE_NEW' | 'VERY_GOOD' | 'GOOD' | 'ACCEPTABLE',
    categoryIds: [] as string[],
    coverImage: '',
    description: '',
    isbn: '',
    publisher: '',
    publishYear: '',
    pageCount: '',
    binding: 'SOFTCOVER' as 'SOFTCOVER' | 'HARDCOVER',
    language: 'Srpski',
    stock: '1',
    isNegotiable: false,
  });

  // Load book data when it's available
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        price: book.price?.toString() || '',
        condition: (book.condition || 'NEW') as any,
        categoryIds: (book as any).categories?.map((c: any) => c.id) || [],
        coverImage: book.coverImage || '',
        description: book.description || '',
        isbn: (book as any).isbn || '',
        publisher: book.publisher || '',
        publishYear: book.publishYear?.toString() || '',
        pageCount: book.pageCount?.toString() || '',
        binding: (book.binding || 'SOFTCOVER') as any,
        language: book.language || 'Srpski',
        stock: book.stock?.toString() || '1',
        isNegotiable: book.isNegotiable || false,
      });
    }
  }, [book]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!formData.title || !formData.author || !formData.price || !formData.coverImage) {
        throw new Error(t('listing.errorRequired'));
      }

      if (formData.categoryIds.length === 0) {
        throw new Error(t('listing.errorCategory'));
      }

      await updateListing({
        id: id!,
        title: formData.title,
        author: formData.author,
        price: parseFloat(formData.price),
        condition: formData.condition,
        categoryIds: formData.categoryIds,
        coverImage: formData.coverImage,
        description: formData.description,
        publisher: formData.publisher,
        publishYear: formData.publishYear ? parseInt(formData.publishYear) : undefined,
        pageCount: formData.pageCount ? parseInt(formData.pageCount) : undefined,
        binding: formData.binding,
        language: formData.language,
        stock: parseInt(formData.stock),
        isNegotiable: formData.isNegotiable,
      });

      navigate('/my-listings');
    } catch (err: any) {
      setError(err.message || 'Greška pri izmeni oglasa');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }));
  };

  if (bookLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-muted-foreground">Učitavanje...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-red-600">Knjiga nije pronađena</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Izmeni oglas
          </h1>
          <p className="text-muted-foreground">
            Ažuriraj detalje knjige
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-sm p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Osnovne informacije</h2>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Naslov knjige *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Autor *
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Cena (RSD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Stanje *
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                  required
                >
                  {BOOK_CONDITIONS.map(cond => (
                    <option key={cond.value} value={cond.value}>
                      {t(`listing.${cond.label}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isNegotiable}
                  onChange={(e) => setFormData({ ...formData, isNegotiable: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-foreground">Cena po dogovoru</span>
              </label>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Kategorije *
            </label>
            <div className="flex flex-wrap gap-2">
              {categories?.map((category: any) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.categoryIds.includes(category.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {(script as any) === 'cyrillic' ? category.nameCyrillic : category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              URL slike naslovne strane *
            </label>
            <input
              type="url"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="https://example.com/cover.jpg"
              required
            />
            {formData.coverImage && (
              <img src={formData.coverImage} alt="Preview" className="mt-2 h-32 object-cover rounded" />
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Opis
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Dodatni detalji</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  ISBN
                </label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Izdavač
                </label>
                <input
                  type="text"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Godina izdanja
                </label>
                <input
                  type="number"
                  value={formData.publishYear}
                  onChange={(e) => setFormData({ ...formData, publishYear: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Broj strana
                </label>
                <input
                  type="number"
                  value={formData.pageCount}
                  onChange={(e) => setFormData({ ...formData, pageCount: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Povez
                </label>
                <select
                  value={formData.binding}
                  onChange={(e) => setFormData({ ...formData, binding: e.target.value as any })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                >
                  <option value="SOFTCOVER">Meki povez</option>
                  <option value="HARDCOVER">Tvrdi povez</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Jezik
                </label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Količina na stanju *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Čuvanje...' : 'Sačuvaj izmene'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/my-listings')}
              disabled={isLoading}
            >
              Otkaži
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
