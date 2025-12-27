/**
 * 分类选择器组件
 * 用于题目编辑页面选择分类标签，也可用于题库页面的筛选
 */
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

// 分类配置类型
export interface CategoryConfig {
  [category: string]: string[];
}

// 分类选择器 Props（用于题目编辑页面 - 网格样式）
export interface CategorySelectorProps {
  categories: CategoryConfig;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  className?: string;
}

/**
 * 分类选择器组件 - 用于题目编辑页面
 * 使用与题库一致的双列网格布局，悬停显示子分类（向右展示）
 * 支持多选功能
 */
export function CategorySelector({
  categories,
  selectedTags,
  onTagsChange,
  className,
}: CategorySelectorProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const isTagSelected = (tag: string) => selectedTags.includes(tag);

  // 检查分类或其子分类是否有被选中的
  const isCategoryActive = (category: string, subCategories: string[]) => (
    isTagSelected(category) || subCategories.some((sub) => isTagSelected(sub))
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Filter className="h-4 w-4" />
          分类
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 已选标签 */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3 pb-3 border-b">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="default"
                className="cursor-pointer text-xs"
                onClick={() => toggleTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
          </div>
        )}

        {/* 分类网格 */}
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(categories).map(([category, subCategories]) => {
            const isActive = isCategoryActive(category, subCategories);
            const isSelected = isTagSelected(category);

            return (
              <div
                key={category}
                className="relative group"
                onMouseEnter={() => setHoveredCategory(category)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <button
                  onClick={() => toggleTag(category)}
                  className={`w-full flex items-center gap-1 px-2 py-1.5 rounded-md text-xs transition-colors text-left ${
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : isActive
                        ? 'bg-primary/20 hover:bg-primary/30'
                        : 'hover:bg-muted'
                  }`}
                >
                  <span className="truncate flex-1">{category}</span>
                  {subCategories.length > 0 && (
                    <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {/* 悬停显示子分类 - 向右展示 */}
                {subCategories.length > 0 && hoveredCategory === category && (
                  <div className="absolute left-full top-0 ml-1 z-50">
                    <div className="bg-popover border rounded-md shadow-md p-2 min-w-[160px] max-w-[240px]">
                      <div className="flex flex-wrap gap-1">
                        {subCategories.map((sub) => (
                          <Badge
                            key={sub}
                            variant={isTagSelected(sub) ? 'default' : 'secondary'}
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTag(sub);
                            }}
                          >
                            {sub}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// 分类侧边栏 Props（用于题库页面筛选）
export interface CategorySidebarProps {
  categories: CategoryConfig;
  onCategoryClick: (category: string) => void;
  className?: string;
}

/**
 * 分类侧边栏组件 - 用于题库页面
 * 双列布局，悬停显示子分类（向左展示，因为在右侧边栏）
 */
export function CategorySidebar({
  categories,
  onCategoryClick,
  className,
}: CategorySidebarProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Filter className="h-4 w-4" />
          分类
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(categories).map(([category, subCategories]) => (
            <div
              key={category}
              className="relative group"
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <button
                onClick={() => onCategoryClick(category)}
                className="w-full flex items-center gap-1 px-2 py-1 rounded-md text-xs hover:bg-muted transition-colors text-left"
              >
                {subCategories.length > 0 && (
                  <ChevronLeft className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                )}
                <span className="truncate">{category}</span>
              </button>
              {/* 悬停显示子分类 - 向左展示 */}
              {subCategories.length > 0 && hoveredCategory === category && (
                <div className="absolute right-full top-0 mr-1 z-50">
                  <div className="bg-popover border rounded-md shadow-md p-2 min-w-[160px] max-w-[240px]">
                    <div className="flex flex-wrap gap-1">
                      {subCategories.map((sub) => (
                        <Badge
                          key={sub}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCategoryClick(sub);
                          }}
                        >
                          {sub}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
