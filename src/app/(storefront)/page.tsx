import { HeroSection } from '@/components/storefront/HeroSection';
import { HotItemsSection } from '@/components/storefront/HotItemsSection';
import { PromoSection } from '@/components/storefront/PromoSection';
import { WhoWeAreSection } from '@/components/storefront/WhoWeAreSection';
import { HowItWorksSection } from '@/components/storefront/HowItWorksSection';
import { TestimonialsSection } from '@/components/storefront/TestimonialsSection';
import { FloatingCartZone } from '@/components/storefront/FloatingCartZone';

export default function StorefrontPage() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <HeroSection />
      <HotItemsSection />
      <PromoSection />
      <WhoWeAreSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FloatingCartZone />
    </div>
  );
}
