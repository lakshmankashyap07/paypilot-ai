import { useWishlistContext } from '../context/WishlistContext';

export const useWishlist = () => {
  return useWishlistContext();
};

export default useWishlist;
