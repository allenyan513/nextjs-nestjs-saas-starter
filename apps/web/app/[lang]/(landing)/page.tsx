import { Hero } from '@/components/landing/hero';
import { FeatureGrid } from '@/components/landing/features';
import { i18nMetadata } from '@/config/i18n-config';
import { Metadata } from 'next';
import FAQ from '@/components/landing/faq';
import { hero3 } from '@/data/hero';
import { useTranslate } from '@/locales/dictionaries';
import { featureData } from '@/data/features';
import { faqData } from '@/data/faqs';
import { CustomersGrid } from '@/components/landing/customers';
import { customers } from '@/data/customers';
import { PricingGrid } from '@/components/landing/pricing';
import { pricingData } from '@/data/pricings';

export async function generateMetadata(props: {
  params: Promise<{
    lang: string;
  }>;
}): Promise<Metadata> {
  const { lang } = await props.params;
  const t = useTranslate(lang);
  return {
    title:
      'ReviewsUp.io - Collect and Show Reviews, Feedback, and Testimonials',
    description:
      'ReviewsUp.io is an open-source platform for collecting and showing reviews, feedback, and testimonials. Built with Next.js, Nest.js, Postgres, and Next Auth, it offers a modern solution for developers.',
    keywords: ['open source reviews'],
    icons: {
      icon: '/favicon.ico',
    },
    alternates: {
      canonical: `https://reviewsup.io/${lang}`,
    },
  };
}

export async function generateStaticParams() {
  return i18nMetadata;
}

export default async function LandingPage(props: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const { lang } = await props.params;
  const t = await useTranslate(lang);

  return (
    <div className="flex flex-col items-center gap-8 md:gap-24 px-4 max-w-7xl mx-auto">
      <div id="hero" />
      <Hero
        capsuleText={t(hero3.capsuleText)}
        capsuleLink={hero3.capsuleLink}
        title={t(hero3.title)}
        subtitle={t(hero3.subtitle)}
        primaryCtaText={t(hero3.primaryCtaText)}
        primaryCtaLink={hero3.primaryCtaLink}
        secondaryCtaText={hero3.secondaryCtaText}
        secondaryCtaLink={hero3.secondaryCtaLink}
        credits={<></>}
      />

      <div id="customers" />
      <CustomersGrid
        title={t(customers.title)}
        subtitle={t(customers.subtitle)}
        items={customers.items}
      />

      <div id="features" />
      <FeatureGrid
        title={t(featureData.title)}
        subtitle={t(featureData.subtitle)}
        items={featureData.items}
      />

      <div id="pricing" />
      <PricingGrid
        title={t(pricingData.title)}
        subtitle={t(pricingData.subtitle)}
        items={pricingData.items}
      />

      <div id={'faqs'} />
      <FAQ data={faqData} />
    </div>
  );
}
