import React from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Tv,
  Smartphone,
  Laptop,
  Shirt,
  Footprints,
  Sparkles,
  Home,
  Headphones,
  Gamepad2,
  Zap,
  Grid
} from 'lucide-react';

const CATEGORIES = [
  { name: 'All', icon: Grid },
  { name: 'Electronics', icon: Tv },
  { name: 'Mobiles', icon: Smartphone },
  { name: 'Laptops', icon: Laptop },
  { name: 'Fashion', icon: Shirt },
  { name: 'Shoes', icon: Footprints },
  { name: 'Beauty', icon: Sparkles },
  { name: 'Home', icon: Home },
  { name: 'Accessories', icon: Headphones },
  { name: 'Gaming', icon: Gamepad2 },
  { name: 'Appliances', icon: Zap }
];

export const CategoryNav = ({ selectedCategory: propSelectedCategory, onSelectCategory }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Active category derived from prop if provided, else directly from URL searchParams
  const urlCategory = searchParams.get('category') || '';
  const activeCategory = propSelectedCategory !== undefined ? propSelectedCategory : urlCategory;

  const handleCategoryClick = (catName) => {
    if (onSelectCategory) {
      onSelectCategory(catName === 'All' ? '' : catName);
    } else {
      const targetCat = catName === 'All' ? '' : catName;
      if (location.pathname === '/shop') {
        const newParams = new URLSearchParams(searchParams);
        if (!targetCat) {
          newParams.delete('category');
        } else {
          newParams.set('category', targetCat);
        }
        newParams.delete('page');
        const qs = newParams.toString();
        navigate(qs ? `/shop?${qs}` : '/shop');
      } else {
        const target = !targetCat ? '/shop' : `/shop?category=${encodeURIComponent(targetCat)}`;
        navigate(target);
      }
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm py-2 px-4 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const catNameLower = cat.name.toLowerCase();
          const activeLower = (activeCategory || '').toLowerCase();

          const isAll = catNameLower === 'all';
          const isSelected = isAll
            ? !activeLower || activeLower === 'all'
            : activeLower === catNameLower ||
              (catNameLower === 'mobiles' && (activeLower === 'smartphones' || activeLower === 'smartphone' || activeLower === 'mobile')) ||
              (catNameLower === 'smartphones' && (activeLower === 'mobiles' || activeLower === 'mobile'));

          return (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className={`flex flex-col items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'text-[#2874F0] font-extrabold bg-blue-50 border border-blue-200 shadow-xs'
                  : 'text-gray-700 hover:text-[#2874F0] hover:bg-gray-50 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 ${isSelected ? 'text-[#2874F0]' : 'text-gray-500'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNav;
