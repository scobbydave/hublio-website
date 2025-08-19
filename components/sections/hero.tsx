import { Button } from "@/components/ui/button"
import Link from "next/link"
import AnimatedHeader, { MiningSection } from "@/components/AnimatedHeader"

export function Hero() {
  return (
    <MiningSection className="relative py-20 lg:py-32 overflow-hidden">
      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <AnimatedHeader>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Improve Communication & Operations with <span className="hublio-text-gradient">HUBLIO</span>
            </h1>
          </AnimatedHeader>
          <AnimatedHeader delay={0.2}>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              A communication-first platform for mining teams that keeps HR workflows intact.
              Coordinate field crews, streamline HR processes like leave and medical bookings, and centralise documents and clocking data —
              all with enterprise-grade security and POPIA compliance.
            </p>
          </AnimatedHeader>
          <AnimatedHeader delay={0.3}>
            <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Communication & Field Coordination</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Digital Leave Management</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Medical Appointments</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Document Management</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Clocking History</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Job Vacancies</span>
            </div>
          </AnimatedHeader>
          <AnimatedHeader delay={0.4}>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button 
                size="lg" 
                asChild 
                className="hublio-gradient border-0 text-white hover:shadow-lg hover:shadow-primary/30 transform hover:scale-105 transition-all duration-300"
              >
                <Link href="/contact">Get Started</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild
                className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
              >
                <Link href="/services">View Features</Link>
              </Button>
            </div>
          </AnimatedHeader>
        </div>
      </div>

      {/* Subtle professional background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 -top-40 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-600/20 via-yellow-500/10 to-orange-400/20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-gray-800/10 via-orange-600/10 to-yellow-400/10 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>
    </MiningSection>
  )
}
