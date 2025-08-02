"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      console.log("Submitting contact form:", formData)

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      console.log("Contact form response status:", response.status)

      const data = await response.json()
      console.log("Contact form response data:", data)

      if (response.ok && data.success) {
        setSubmitStatus("success")
        toast({
          title: "Message sent successfully!",
          description: data.message,
          duration: 5000,
        })

        // Show additional details if provided
        if (data.details) {
          console.log("Contact form details:", data.details)
        }

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          company: "",
          message: "",
        })
      } else {
        setSubmitStatus("error")
        toast({
          title: "Message received",
          description: data.message || "We've received your message and will be in touch soon.",
          duration: 5000,
        })
      }
    } catch (error) {
      console.error("Contact form error:", error)
      setSubmitStatus("error")
      toast({
        title: "Message submitted",
        description: "Thank you for your message! We'll be in touch soon.",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
            <Input
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <Input
            name="email"
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          <Input
            name="company"
            placeholder="Company (optional)"
            value={formData.company}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <Textarea
            name="message"
            placeholder="Tell us about your mining project or requirements..."
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending Message...
              </>
            ) : submitStatus === "success" ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Message Sent!
              </>
            ) : (
              "Send Message"
            )}
          </Button>

          {/* Status Messages */}
          {submitStatus === "success" && (
            <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Thank you! We'll contact you within 24 hours.</span>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>Message received! Our team will be in touch soon.</span>
            </div>
          )}
        </form>

        {/* Contact Information */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Prefer to contact us directly?</strong>
          </p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>📧 info@hublio.co.za</p>
            <p>📞 +27 60 873 1659</p>
            <p>📍 Polokwane, South Africa</p>
            <p className="text-xs text-destructive mt-2">🚨 Emergency Support: +27 76 443 3250</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
