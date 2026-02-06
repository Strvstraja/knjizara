import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { createListing } from 'wasp/client/operations';
import { useQuery } from 'wasp/client/operations';
import { getCategories } from 'wasp/client/operations';
import { Button } from '../client/components/ui/button';
import { useScript } from '../client/contexts/ScriptContext';
import StepIndicator from './components/StepIndicator';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BOOK_CONDITIONS = [
  { value: 'NEW', label: 'conditionNew' },
  { value: 'LIKE_NEW', label: 'conditionLikeNew' },
  { value: 'VERY_GOOD', label: 'conditionVeryGood' },
  { value: 'GOOD', label: 'conditionGood' },
  { value: 'ACCEPTABLE', label: 'conditionAcceptable' },
] as const;

const STEPS = ['osnovno', 'detalji', 'dodatno', 'pregled'];

export default function CreateListingPageNew() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { script } = useScript();
  const { data: categories } = useQuery(getCategories);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    coverImage: '',
    isNegotiable: false,
    condition: 'NEW' as const,
    categoryIds: [] as string[],
    description: '',
    isbn: '',
    publisher: '',
    publishYear: '',
    pageCount: '',
    binding: 'SOFTCOVER' as const,
    language: 'Srpski',
    stock: '1',
  });

  const handleNext = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.title || !formData.author || !formData.price || !formData.coverImage) {
        setError(t('listing.errorRequired'));
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.condition || formData.categoryIds.length === 0) {
        setError(t('listing.errorCategory'));
        return;
      }
    }

    setError(null);
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await createListing({
        title: formData.title,
        author: formData.author,
        price: parseFloat(formData.price),
        condition: formData.condition,
        categoryIds: formData.categoryIds,
        coverImage: formData.coverImage,
        description: formData.description,
        isbn: formData.isbn,
        publisher: formData.publisher,
        publishYear: formData.publishYear ? parseInt(formData.publishYear) : undefined,
        pageCount: formData.pageCount ? parseInt(formData.pageCount) : undefined,
        binding: formData.binding,
        language: formData.language,
        stock: parseInt(formData.stock),
        isNegotiable: formData.isNegotiable,
        images: [formData.coverImage],
      });

      navigate('/my-listings');
    } catch (err: any) {
      setError(err.message || t('listing.errorCreate'));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: [categoryId] // Single select
    }));
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('listing.create')}
          </h1>
          <p className="text-muted-foreground">
            {t('listing.subtitle')}
          </p>
        </div>

        <StepIndicator currentStep={currentStep} steps={STEPS} />

        <div className="bg-card rounded-lg p-6 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Step 1: Osnovno */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('listing.title')} *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-background text-foreground"
                  placeholder={t('listing.titlePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('listing.author')} *
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-background text-foreground"
                  placeholder={t('listing.authorPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('listing.price')} (RSD) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-background text-foreground"
                  placeholder={t('listing.pricePlaceholder')}
                />
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isNegotiable}
                    onChange={(e) => setFormData({ ...formData, isNegotiable: e.target.checked })}
                    className="rounded border-input text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm text-foreground">{t('listing.negotiable')}</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('listing.coverImage')} (URL) *
                </label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-background text-foreground"
                  placeholder={t('listing.coverImagePlaceholder')}
                />
                {formData.coverImage && (
                  <img 
                    src={formData.coverImage} 
                    alt="Preview" 
                    className="mt-3 h-40 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Step 2: Detalji */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('listing.condition')} *
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-background text-foreground"
                >
                  {BOOK_CONDITIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {t(`listing.${label}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  {t('listing.category')} *
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories?.filter(cat => !cat.parentId).map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium transition-colors
                        ${
                          formData.categoryIds.includes(category.id)
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }
                      `}
                    >
                      {script === 'sr-Cyrl' ? category.nameCyrillic : category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('listing.description')}
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-background text-foreground"
                  placeholder={t('listing.descriptionPlaceholder')}
                />
              </div>
            </div>
          )}

          {/* Step 3: Dodatno */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-lg">
                {t('listing.allFieldsOptional')}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('listing.isbn')}
                  </label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('listing.publisher')}
                  </label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-background text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('listing.publishYear')}
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.publishYear}
                    onChange={(e) => setFormData({ ...formData, publishYear: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('listing.pageCount')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.pageCount}
                    onChange={(e) => setFormData({ ...formData, pageCount: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('listing.binding')}
                  </label>
                  <select
                    value={formData.binding}
                    onChange={(e) => setFormData({ ...formData, binding: e.target.value as any })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-background text-foreground"
                  >
                    <option value="SOFTCOVER">{t('listing.bindingSoftcover')}</option>
                    <option value="HARDCOVER">{t('listing.bindingHardcover')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('listing.language')}
                </label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-background text-foreground"
                />
              </div>
            </div>
          )}

          {/* Step 4: Pregled */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {t('listing.preview')}
              </h3>

              {/* Book Card Preview */}
              <div className="bg-muted rounded-lg p-6">
                <div className="flex gap-4">
                  <img
                    src={formData.coverImage}
                    alt={formData.title}
                    className="w-32 h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/128x192?text=No+Image';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-foreground mb-1">
                      {formData.title}
                    </h4>
                    <p className="text-muted-foreground mb-3">{formData.author}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-bold text-foreground">
                        {parseFloat(formData.price).toLocaleString('sr-RS')} <span className="text-sm text-muted-foreground">RSD</span>
                      </span>
                      {formData.isNegotiable && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {t('listing.negotiable')}
                        </span>
                      )}
                    </div>

                    <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded">
                      {t(`listing.${BOOK_CONDITIONS.find(c => c.value === formData.condition)?.label}`)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">{t('listing.summary')}</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t('listing.title')}:</dt>
                    <dd className="font-medium text-foreground">{formData.title}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t('listing.author')}:</dt>
                    <dd className="font-medium text-foreground">{formData.author}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t('listing.price')}:</dt>
                    <dd className="font-medium text-foreground">{formData.price} RSD</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t('listing.condition')}:</dt>
                    <dd className="font-medium text-foreground">
                      {t(`listing.${BOOK_CONDITIONS.find(c => c.value === formData.condition)?.label}`)}
                    </dd>
                  </div>
                  {formData.categoryIds.length > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">{t('listing.category')}:</dt>
                      <dd className="font-medium text-foreground">
                        {categories?.find(c => c.id === formData.categoryIds[0])
                          ? script === 'sr-Cyrl' 
                            ? categories.find(c => c.id === formData.categoryIds[0])?.nameCyrillic
                            : categories.find(c => c.id === formData.categoryIds[0])?.name
                          : ''}
                      </dd>
                    </div>
                  )}
                  {formData.description && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">{t('listing.description')}:</dt>
                      <dd className="font-medium text-foreground text-right max-w-xs">{formData.description}</dd>
                    </div>
                  )}
                  {formData.isbn && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">{t('listing.isbn')}:</dt>
                      <dd className="font-medium text-foreground">{formData.isbn}</dd>
                    </div>
                  )}
                  {formData.publisher && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">{t('listing.publisher')}:</dt>
                      <dd className="font-medium text-foreground">{formData.publisher}</dd>
                    </div>
                  )}
                  {formData.publishYear && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">{t('listing.publishYear')}:</dt>
                      <dd className="font-medium text-foreground">{formData.publishYear}</dd>
                    </div>
                  )}
                  {formData.pageCount && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">{t('listing.pageCount')}:</dt>
                      <dd className="font-medium text-foreground">{formData.pageCount}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                {t('listing.canGoBack')}
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-border">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                {t('listing.back')}
              </Button>
            )}
            
            {currentStep < STEPS.length ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
              >
                {t('listing.next')}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
              >
                {isLoading ? t('common.loading') : t('listing.publish')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
