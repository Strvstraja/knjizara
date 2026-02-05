import type { User } from "wasp/entities";
import { useState } from "react";
import { useQuery } from "wasp/client/operations";
import { getSellerProfile, updateSellerProfile } from "wasp/client/operations";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../client/components/ui/card";
import { Separator } from "../client/components/ui/separator";
import { Pencil, Check, X } from "lucide-react";

export default function AccountPage({ user }: { user: User }) {
  const { data: sellerProfile, refetch } = useQuery(getSellerProfile);
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleEditDisplayName = () => {
    setDisplayName(sellerProfile?.displayName || "");
    setIsEditingDisplayName(true);
  };

  const handleSaveDisplayName = async () => {
    if (!displayName.trim()) return;
    
    setIsSaving(true);
    try {
      await updateSellerProfile({ displayName: displayName.trim() });
      await refetch();
      setIsEditingDisplayName(false);
    } catch (error) {
      console.error('Error updating display name:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingDisplayName(false);
    setDisplayName("");
  };

  return (
    <div className="mt-10 px-6">
      <Card className="mb-4 lg:m-8">
        <CardHeader>
          <CardTitle className="text-foreground text-base font-semibold leading-6">
            Informacije o nalogu
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {!!user.email && (
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                  <div className="text-muted-foreground text-sm font-medium">
                    Email adresa
                  </div>
                  <div className="text-foreground mt-1 text-sm sm:col-span-2 sm:mt-0">
                    {user.email}
                  </div>
                </div>
              </div>
            )}
            {!!user.username && (
              <>
                <Separator />
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                    <div className="text-muted-foreground text-sm font-medium">
                      Korisničko ime
                    </div>
                    <div className="text-foreground mt-1 text-sm sm:col-span-2 sm:mt-0">
                      {user.username}
                    </div>
                  </div>
                </div>
              </>
            )}
            <Separator />
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                <div className="text-muted-foreground text-sm font-medium">
                  Ime prodavca
                </div>
                <div className="text-foreground mt-1 text-sm sm:col-span-2 sm:mt-0">
                  {isEditingDisplayName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Unesite ime prodavca"
                        disabled={isSaving}
                      />
                      <button
                        onClick={handleSaveDisplayName}
                        disabled={isSaving || !displayName.trim()}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-md disabled:opacity-50"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{sellerProfile?.displayName || "Nije postavljeno"}</span>
                      <button
                        onClick={handleEditDisplayName}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
