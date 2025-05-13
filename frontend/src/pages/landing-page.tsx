import CallToAction from "@/components/call-to-action";
import FeaturesSection from "@/components/features";
import FooterSection from "@/components/footer";
import IntegrationsSection from "@/components/integrations";
import { Hero } from "@/components/ui/animated-hero";
import { HeroHeader } from "@/components/ui/landing-header";


export default function LandingPage(){

    return(
        <main>
            <HeroHeader/>
            <Hero/>
            <FeaturesSection/>
            <IntegrationsSection/>
            <CallToAction/>
            <FooterSection/>
        </main>
    )
}
