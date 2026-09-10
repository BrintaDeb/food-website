import { Utensils, MapPin, PackageCheck, ArrowRight } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      title: 'Select Regional Delicacies',
      desc: 'Explore royal dum biryanis, slow-simmered dal sambar, tandoori breads, and decadent rabdi sweets.',
      icon: Utensils
    },
    {
      num: '02',
      title: 'Track Live Dispatch',
      desc: 'Follow your order status in real-time with our interactive live Leaflet GPS courier dispatch tracker.',
      icon: MapPin
    },
    {
      num: '03',
      title: 'Relish Royal Flavors',
      desc: 'Steaming hot, aromatic, tamper-sealed handi meals delivered fresh directly to your doorstep.',
      icon: PackageCheck
    }
  ];

  return (
    <section id="howItWorksSection" className="py-16 sm:py-24 bg-white border-y border-[#E8E5E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#FF5E00]/10 text-[#FF5E00] text-xs font-black tracking-widest uppercase">
            How Does It Work
          </span>
          <h2 className="text-3xl sm:text-5xl font-outfit font-black text-[#1A1311] tracking-tight">
            Seamless Ordering in 3 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative p-8 rounded-3xl bg-[#FFFDF9] border border-[#E8E5E0] shadow-card hover:shadow-float hover:-translate-y-1.5 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-[#FF5E00] text-white flex items-center justify-center shadow-badge">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-outfit font-black text-3xl text-neutral-200 group-hover:text-[#FF8516]/40 transition-colors">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="font-outfit font-black text-xl text-[#1A1311]">{step.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{step.desc}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-200/60 flex items-center gap-2 text-xs font-bold text-[#FF5E00]">
                  <span>Step {idx + 1} of 3</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
