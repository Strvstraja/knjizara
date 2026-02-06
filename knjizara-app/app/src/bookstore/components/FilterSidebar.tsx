import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../client/components/ui/accordion';

interface FilterSidebarProps {
  sortBy: string;
  setSortBy: (value: any) => void;
  categoryId?: string;
  setCategoryId: (value: string | undefined) => void;
  condition?: string;
  setCondition: (value: string | undefined) => void;
  sellerType?: string;
  setSellerType: (value: string | undefined) => void;
  minPrice?: number;
  setMinPrice: (value: number | undefined) => void;
  maxPrice?: number;
  setMaxPrice: (value: number | undefined) => void;
  categories?: any[];
  onClearFilters: () => void;
  setPage: (page: number) => void;
}

export default function FilterSidebar({
  sortBy,
  setSortBy,
  categoryId,
  setCategoryId,
  condition,
  setCondition,
  sellerType,
  setSellerType,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  categories,
  onClearFilters,
  setPage,
}: FilterSidebarProps) {
  const { t, i18n } = useTranslation();
  const isCyrillic = i18n.language === 'sr-Cyrl';

  const handleFilterChange = (setter: (value: any) => void, value: any) => {
    setter(value);
    setPage(1);
  };

  const hasActiveFilters = categoryId || condition || sellerType || minPrice || maxPrice;

  return (
    <aside className="w-64 space-y-6">
      {/* Sort dropdown */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t('books.sort')}
        </label>
        <select
          value={sortBy}
          onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
          className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
        >
          <option value="newest">{t('books.sortNewest')}</option>
          <option value="price_asc">{t('books.sortPriceAsc')}</option>
          <option value="price_desc">{t('books.sortPriceDesc')}</option>
          <option value="title">{t('books.sortTitle')}</option>
        </select>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="font-medium text-foreground mb-3">{t('books.category')}</h3>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {/* All Categories */}
          <button
            onClick={() => handleFilterChange(setCategoryId, undefined)}
            className={`
              w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm
              transition-colors duration-150
              ${
                !categoryId
                  ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100 font-medium'
                  : 'text-foreground hover:bg-muted'
              }
            `}
          >
            <span>{t('books.allCategories')}</span>
            <span className={`
              text-xs
              ${
                !categoryId
                  ? 'text-amber-700 dark:text-amber-400'
                  : 'text-muted-foreground'
              }
            `}>
              {categories?.reduce((sum, cat) => sum + (cat._count?.books || 0), 0) || 0}
            </span>
          </button>

          {/* Accordion for categories */}
          <Accordion type="multiple" className="w-full">
            {categories?.filter(cat => !cat.parentId).map((category) => {
              const hasChildren = category.children && category.children.length > 0;
              
              if (!hasChildren) {
                // Category without children - just a button
                return (
                  <button
                    key={category.id}
                    onClick={() => handleFilterChange(setCategoryId, category.id)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm
                      transition-colors duration-150
                      ${
                        categoryId === category.id
                          ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100 font-medium'
                          : 'text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    <span>{isCyrillic ? category.nameCyrillic : category.name}</span>
                    <span className={`
                      text-xs
                      ${
                        categoryId === category.id
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-muted-foreground'
                      }
                    `}>
                      {category._count?.books || 0}
                    </span>
                  </button>
                );
              }

              // Category with children - accordion item
              return (
                <AccordionItem key={category.id} value={category.id} className="border-none">
                  <AccordionTrigger className="py-2 px-3 hover:bg-muted rounded-lg hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange(setCategoryId, category.id);
                        }}
                        className={`
                          text-sm
                          ${
                            categoryId === category.id
                              ? 'text-amber-900 dark:text-amber-100 font-medium'
                              : 'text-foreground'
                          }
                        `}
                      >
                        {isCyrillic ? category.nameCyrillic : category.name}
                      </button>
                      <span className="text-xs text-muted-foreground">
                        {category._count?.books || 0}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0">
                    <div className="space-y-1 pl-4">
                      {category.children?.map((child: any) => (
                        <button
                          key={child.id}
                          onClick={() => handleFilterChange(setCategoryId, child.id)}
                          className={`
                            w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm
                            transition-colors duration-150
                            ${
                              categoryId === child.id
                                ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100 font-medium'
                                : 'text-foreground hover:bg-muted'
                            }
                          `}
                        >
                          <span>{isCyrillic ? child.nameCyrillic : child.name}</span>
                          <span className={`
                            text-xs
                            ${
                              categoryId === child.id
                                ? 'text-amber-700 dark:text-amber-400'
                                : 'text-muted-foreground'
                            }
                          `}>
                            {child._count?.books || 0}
                          </span>
                        </button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>

      {/* Condition Filter */}
      <div>
        <h3 className="font-medium text-foreground mb-3">{t('books.condition')}</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="condition"
              checked={!condition}
              onChange={() => handleFilterChange(setCondition, undefined)}
              className="border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">{t('books.allConditions')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="condition"
              checked={condition === 'NEW'}
              onChange={() => handleFilterChange(setCondition, 'NEW')}
              className="border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">{t('books.conditionNew')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="condition"
              checked={condition === 'LIKE_NEW'}
              onChange={() => handleFilterChange(setCondition, 'LIKE_NEW')}
              className="border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">{t('books.conditionLikeNew')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="condition"
              checked={condition === 'VERY_GOOD'}
              onChange={() => handleFilterChange(setCondition, 'VERY_GOOD')}
              className="border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">{t('books.conditionVeryGood')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="condition"
              checked={condition === 'GOOD'}
              onChange={() => handleFilterChange(setCondition, 'GOOD')}
              className="border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">{t('books.conditionGood')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="condition"
              checked={condition === 'ACCEPTABLE'}
              onChange={() => handleFilterChange(setCondition, 'ACCEPTABLE')}
              className="border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">{t('books.conditionAcceptable')}</span>
          </label>
        </div>
      </div>

      {/* Seller Type Filter */}
      <div>
        <h3 className="font-medium text-foreground mb-3">{t('books.sellerType')}</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="seller"
              checked={!sellerType}
              onChange={() => handleFilterChange(setSellerType, undefined)}
              className="border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">{t('books.allSellers')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="seller"
              checked={sellerType === 'PRIVATE'}
              onChange={() => handleFilterChange(setSellerType, 'PRIVATE')}
              className="border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">{t('books.sellerPrivate')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="seller"
              checked={sellerType === 'BUSINESS'}
              onChange={() => handleFilterChange(setSellerType, 'BUSINESS')}
              className="border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">{t('books.sellerBusiness')}</span>
          </label>
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="font-medium text-foreground mb-3">{t('books.priceRange')}</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder={t('books.priceFrom')}
            value={minPrice || ''}
            onChange={(e) => handleFilterChange(setMinPrice, e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
          />
          <span className="text-muted-foreground">-</span>
          <input
            type="number"
            placeholder={t('books.priceTo')}
            value={maxPrice || ''}
            onChange={(e) => handleFilterChange(setMaxPrice, e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground py-2 transition-colors"
        >
          <X className="w-4 h-4" />
          {t('books.clearFilters')}
        </button>
      )}
    </aside>
  );
}
