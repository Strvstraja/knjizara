import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getMyListings, toggleListingStatus, markAsSold, deleteListing } from 'wasp/client/operations';
import { Button } from '../client/components/ui/button';
import { Plus, Edit, Pause, Play, CheckCircle, Trash2, BookOpen, PauseCircle, ShoppingBag } from 'lucide-react';

type ListingStatus = 'ACTIVE' | 'PAUSED' | 'SOLD' | 'EXPIRED';

export default function MyListingsPage() {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<ListingStatus | undefined>();
  const { data, isLoading, refetch } = useQuery(getMyListings, { status: statusFilter });

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
      await toggleListingStatus({ id, status: newStatus as any });
      refetch();
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleMarkSold = async (id: string) => {
    if (!confirm(t('listing.confirmMarkSold') || 'Da li ste sigurni da želite da označite kao prodato?')) {
      return;
    }
    try {
      await markAsSold({ id });
      refetch();
    } catch (err) {
      console.error('Error marking as sold:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('listing.confirmDelete'))) {
      return;
    }
    try {
      await deleteListing({ id });
      refetch();
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500 text-white';
      case 'PAUSED': return 'bg-amber-500 text-white';
      case 'SOLD': return 'bg-gray-500 text-white';
      case 'EXPIRED': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getConditionBadgeColor = (condition: string) => {
    switch (condition) {
      case 'NEW': return 'bg-green-500';
      case 'LIKE_NEW': return 'bg-teal-500';
      case 'VERY_GOOD': return 'bg-blue-500';
      case 'GOOD': return 'bg-yellow-500';
      case 'ACCEPTABLE': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t('listing.myListings')}
            </h1>
          </div>
          <Link to="/create-listing">
            <Button className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {t('listing.create')}
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg p-4 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <BookOpen className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ukupno</p>
                <p className="text-2xl font-bold text-foreground">{data?.total || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Aktivno</p>
                <p className="text-2xl font-bold text-green-600">
                  {data?.books?.filter((b: any) => b.status === 'ACTIVE').length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <PauseCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pauzirano</p>
                <p className="text-2xl font-bold text-amber-600">
                  {data?.books?.filter((b: any) => b.status === 'PAUSED').length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Prodato</p>
                <p className="text-2xl font-bold text-blue-600">
                  {data?.books?.filter((b: any) => b.status === 'SOLD').length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setStatusFilter(undefined)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !statusFilter
                ? 'bg-amber-500 text-white'
                : 'bg-card text-foreground hover:bg-accent'
            }`}
          >
            {t('listing.all')} ({data?.total || 0})
          </button>
          {(['ACTIVE', 'PAUSED', 'SOLD', 'EXPIRED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-amber-500 text-white'
                  : 'bg-card text-foreground hover:bg-accent'
              }`}
            >
              {t(`listing.status${status.charAt(0) + status.slice(1).toLowerCase()}`)}
            </button>
          ))}
        </div>

        {/* Listings Grid */}
        {!data?.books || data.books.length === 0 ? (
          <div className="bg-card rounded-lg p-12 text-center">
            <p className="text-muted-foreground mb-4">
              {statusFilter 
                ? t('listing.noListingsStatus')
                : t('listing.noListings')}
            </p>
            {!statusFilter && (
              <Link to="/create-listing">
                <Button>
                  <Plus className="h-5 w-5 mr-2" />
                  {t('listing.createFirst')}
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.books.map((book: any) => (
              <div key={book.id} className={`bg-card rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all ${
                book.status === 'SOLD' || book.status === 'EXPIRED' ? 'opacity-75' : ''
              }`}>
                {/* Image */}
                <div className="relative h-48 bg-muted">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className={`w-full h-full object-cover ${
                      book.status === 'SOLD' || book.status === 'EXPIRED' ? 'grayscale' : ''
                    }`}
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(book.status)}`}>
                      {t(`listing.status${book.status.charAt(0) + book.status.slice(1).toLowerCase()}`)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                    {book.author}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-primary">
                      {book.price.toFixed(2)} {t('common.rsd')}
                    </span>
                    {book.isNegotiable && (
                      <span className="text-xs text-muted-foreground">
                        {t('listing.negotiable')}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground mb-4">
                    <p>{t('listing.views')}: {book.viewCount || 0}</p>
                    <p>{t('listing.stockLabel')}: {book.stock}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 justify-center">
                    <Link to={`/edit-listing/${book.id}`}>
                      <button
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title={t('listing.edit')}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    </Link>
                    
                    {book.status === 'ACTIVE' && (
                      <>
                        <button
                          onClick={() => handleToggleStatus(book.id, book.status)}
                          className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title={t('listing.pause')}
                        >
                          <Pause className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleMarkSold(book.id)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title={t('listing.markSold')}
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    
                    {book.status === 'PAUSED' && (
                      <>
                        <button
                          onClick={() => handleToggleStatus(book.id, book.status)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title={t('listing.activate')}
                        >
                          <Play className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleMarkSold(book.id)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title={t('listing.markSold')}
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handleDelete(book.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={t('listing.delete')}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
