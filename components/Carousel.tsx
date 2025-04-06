'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CarouselItem {
  title: string;
  description: string;
  imageSrc?: string;
  imageUrl?: string; // For backward compatibility
  imageAlt?: string;
  bgColorClass?: string;
  textColorClass?: string;
  headingColorClass?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

export default function Carousel({
  items,
  autoSlide = false,
  autoSlideInterval = 5000,
}: CarouselProps) {
  // State to track the current image index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigation functions
  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? items.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === items.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Auto slide effect
  useEffect(() => {
    if (!autoSlide) return;

    const slideInterval = setInterval(goToNext, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [currentIndex, autoSlide, autoSlideInterval]);

  // Get current item
  const currentItem = items[currentIndex];

  // Handle potential undefined items gracefully
  if (!currentItem) return null;

  // Determine image source (support both imageSrc and imageUrl props)
  const imageSource =
    currentItem.imageSrc || currentItem.imageUrl || '/placeholder.svg';
  const imageAlt =
    currentItem.imageAlt || currentItem.title || 'Carousel image';

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="relative flex items-center justify-center">
        {/* Left navigation button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 z-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
          onClick={goToPrevious}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Main image container */}
        <div className="w-full max-w-3xl mx-auto">
          <div
            className={`${
              currentItem.bgColorClass || 'bg-card'
            } rounded-lg overflow-hidden shadow-lg`}
          >
            <div className="p-6 pb-3">
              <h2
                className={`text-2xl font-semibold mb-2 text-center ${
                  currentItem.headingColorClass || ''
                }`}
              >
                {currentItem.title}
              </h2>
            </div>
            <div className="relative aspect-video w-full">
              <Image
                src={imageSource}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                priority
              />
            </div>
            <div className="p-6">
              <p
                className={`text-center ${
                  currentItem.textColorClass || 'text-muted-foreground'
                }`}
              >
                {currentItem.description}
              </p>
            </div>
          </div>

          {/* Image counter */}
          <div className="text-center mt-4 text-sm text-muted-foreground">
            {currentIndex + 1} / {items.length}
          </div>
        </div>

        {/* Right navigation button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 z-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
          onClick={goToNext}
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
