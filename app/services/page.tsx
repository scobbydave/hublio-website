import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Calendar, 
  Shield, 
  FileText, 
  Users, 
  Clock, 
  Briefcase,
  Bell,
  Settings,
  Activity,
  UserCheck,
  FolderOpen,
  Stethoscope
} from "lucide-react"

const services = [
  {
    title: "Digital Leave Management",
    description:
      "Comprehensive leave application, approval, and tracking system with automated workflows, balance monitoring, and mobile accessibility for mining shift workers.",
    icon: Calendar,
    features: ["Online leave applications", "Multi-level approval workflows", "Real-time balance tracking", "Mobile-friendly interface", "Integration with payroll systems"],
    color: "primary",
  },
  {
    title: "Medical Appointment Booking",
    description:
      "Streamlined medical appointment scheduling with certificate management, approval workflows, and integration with clinic systems for occupational health compliance.",
    icon: Stethoscope,
    features: ["Appointment request system", "Medical certificate uploads", "Clinic integration", "Approval workflows", "Health compliance tracking"],
    color: "secondary",
  },
  {
    title: "Document Management System",
    description:
      "Centralized document repository with secure access control, acknowledgment tracking, and compliance monitoring for safety and operational documents.",
    icon: FileText,
    features: ["Secure document storage", "Access control & permissions", "Document acknowledgments", "Version control", "Compliance reporting"],
    color: "primary",
  },
  {
    title: "User Roles & Permissions",
    description:
      "Sophisticated user management system with role-based access control, onboarding workflows, and comprehensive permission management for mining operations.",
    icon: Users,
    features: ["Role-based access control", "User onboarding workflows", "Permission management", "Department-based access", "Security audit trails"],
    color: "secondary",
  },
  {
    title: "Clocking History Monitoring",
    description:
      "Comprehensive time and attendance tracking with shift monitoring, overtime calculations, and integration with existing clocking systems.",
    icon: Clock,
    features: ["Real-time clocking data", "Shift pattern tracking", "Overtime monitoring", "Attendance reports", "Integration capabilities"],
    color: "primary",
  },
  {
    title: "Job Vacancy Management",
    description:
      "Complete recruitment platform for posting positions, managing applications, and tracking candidate progress through the mining industry hiring process.",
    icon: Briefcase,
    features: ["Job posting system", "Application management", "Candidate tracking", "Interview scheduling", "Skills-based matching"],
    color: "secondary",
  },
  {
    title: "Content Publishing Platform",
    description:
      "Dynamic content management for wellness programs, safety updates, mining news, and health awareness campaigns with targeted distribution capabilities.",
    icon: FolderOpen,
    features: ["Content creation tools", "Targeted distribution", "Wellness programs", "Safety communications", "Engagement tracking"],
    color: "primary",
  },
  {
    title: "Smart Notification System",
    description:
      "Intelligent notification engine with workflow alerts, priority-based messaging, and multi-channel delivery for critical mining operations communications.",
    icon: Bell,
    features: ["Workflow notifications", "Priority-based alerts", "Multi-channel delivery", "Escalation procedures", "Read confirmations"],
    color: "secondary",
  },
  {
    title: "Employee Profile Management",
    description:
      "Comprehensive employee data management with skills tracking, certification monitoring, and career development pathways for mining professionals.",
    icon: UserCheck,
    features: ["Complete profile management", "Skills & certifications", "Career development", "Performance tracking", "Emergency contacts"],
    color: "primary",
  },
  {
    title: "Booking Management",
    description:
      "Versatile booking system for training sessions, safety inductions, equipment access, and facility reservations with automated confirmations.",
    icon: Activity,
    features: ["Multi-purpose booking system", "Automated confirmations", "Resource scheduling", "Capacity management", "Booking analytics"],
    color: "secondary",
  },
  {
    title: "System Configuration",
    description:
      "Flexible configuration tools for mine-specific settings, clinic setups, department structures, and operational parameters with admin controls.",
    icon: Settings,
    features: ["Mine configuration", "Clinic setup", "Department management", "Operational parameters", "Admin dashboards"],
    color: "primary",
  },
  {
    title: "Audit Logs & Compliance",
    description:
      "Comprehensive audit trail system ensuring POPIA compliance, data protection, and complete activity monitoring for regulatory requirements.",
    icon: Shield,
    features: ["Complete audit trails", "POPIA compliance", "Data protection", "Activity monitoring", "Compliance reporting"],
    color: "secondary",
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 lg:py-32 hublio-gradient">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center text-white">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Complete HR Platform</h1>
              <p className="mt-6 text-lg leading-8 opacity-90">
                Comprehensive HR and operational platform designed specifically for mining companies. 
                Streamline workforce management, enhance compliance, and improve operational efficiency 
                with our integrated digital solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What We Offer</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Cutting-edge solutions tailored for the mining industry
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={service.title} className={`border-${service.color}/20 hover:shadow-lg transition-shadow`}>
                  <CardHeader>
                    <div
                      className={`h-12 w-12 rounded-lg bg-${service.color}/10 flex items-center justify-center mb-4`}
                    >
                      <service.icon className={`h-6 w-6 text-${service.color}`} />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm">
                          <div className={`h-1.5 w-1.5 rounded-full bg-${service.color} mr-2`}></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Process</h2>
              <p className="mt-4 text-lg text-muted-foreground">How we work with you to deliver exceptional results</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Discovery</h3>
                <p className="text-sm text-muted-foreground">
                  We analyze your current operations and identify opportunities for improvement.
                </p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-secondary">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Strategy</h3>
                <p className="text-sm text-muted-foreground">
                  We develop a customized AI strategy tailored to your specific needs and goals.
                </p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Implementation</h3>
                <p className="text-sm text-muted-foreground">
                  We deploy and integrate our solutions with minimal disruption to your operations.
                </p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-secondary">4</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  We continuously monitor and optimize performance to ensure maximum ROI.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Contact us today to learn how our AI-powered solutions can transform your mining operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/contact">Get a Quote</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
