import { BznxFooter } from '@/components/ui/footer-section';
import { getCMSData } from '@/lib/cms';
import FooterModel from '@/lib/models/Footer';

interface FooterProps {
  locale: string;
}

export default async function Footer({ locale }: FooterProps) {
  const data = await getCMSData(FooterModel);
  return <BznxFooter locale={locale} data={data} />;
}
