"use client"

import { useCallback } from 'react'
import { trackEvent, trackUserInteraction, trackBusinessGoal, trackMiningEvent } from '@/components/analytics'

export function useAnalytics() {
  const trackPageView = useCallback((pageName: string, additionalData?: Record<string, any>) => {
    trackEvent('page_view', {
      page_name: pageName,
      ...additionalData
    })
  }, [])

  const trackClick = useCallback((elementName: string, section: string, additionalData?: Record<string, any>) => {
    trackUserInteraction('click', section, {
      element: elementName,
      ...additionalData
    })
  }, [])

  const trackFormSubmission = useCallback((formName: string, success: boolean, additionalData?: Record<string, any>) => {
    trackEvent('form_submit', {
      form_name: formName,
      success: success,
      event_category: 'form_interaction',
      ...additionalData
    })
  }, [])

  const trackDownload = useCallback((fileName: string, fileType: string, additionalData?: Record<string, any>) => {
    trackEvent('file_download', {
      file_name: fileName,
      file_type: fileType,
      event_category: 'download',
      ...additionalData
    })
  }, [])

  const trackSearch = useCallback((searchTerm: string, section: string, resultsCount?: number) => {
    trackEvent('search', {
      search_term: searchTerm,
      section: section,
      results_count: resultsCount || 0,
      event_category: 'search'
    })
  }, [])

  // Mining-specific tracking functions
  const trackVacancyView = useCallback((vacancyId: string, vacancyTitle: string, company: string) => {
    trackMiningEvent('vacancy_view', {
      vacancy_id: vacancyId,
      vacancy_title: vacancyTitle,
      company: company
    })
  }, [])

  const trackComplianceCheck = useCallback((checkType: string, result: string) => {
    trackMiningEvent('compliance_check', {
      check_type: checkType,
      result: result
    })
  }, [])

  const trackChatInteraction = useCallback((question: string, responseType: 'ai' | 'fallback') => {
    trackMiningEvent('chat_interaction', {
      question_category: question.substring(0, 50), // First 50 chars for privacy
      response_type: responseType
    })
  }, [])

  const trackContactInquiry = useCallback((inquiryType: string, method: 'form' | 'email' | 'phone') => {
    trackMiningEvent('contact_inquiry', {
      inquiry_type: inquiryType,
      contact_method: method
    })
    trackBusinessGoal('lead_generation', 1)
  }, [])

  const trackRegulationHubUsage = useCallback((feature: string, action: string) => {
    trackEvent('regulation_hub_usage', {
      feature: feature,
      action: action,
      event_category: 'compliance_tools'
    })
  }, [])

  const trackAdminAction = useCallback((action: string, section: string, success: boolean) => {
    trackEvent('admin_action', {
      action: action,
      section: section,
      success: success,
      event_category: 'admin_operations'
    })
  }, [])

  const trackSalaryInsightView = useCallback((insightId: string, jobTitle: string, region: string) => {
    trackEvent('salary_insight_view', {
      insight_id: insightId,
      job_title: jobTitle,
      region: region,
      event_category: 'salary_insights'
    })
  }, [])

  return {
    trackPageView,
    trackClick,
    trackFormSubmission,
    trackDownload,
    trackSearch,
    trackVacancyView,
    trackComplianceCheck,
    trackChatInteraction,
    trackContactInquiry,
    trackRegulationHubUsage,
    trackAdminAction,
    trackSalaryInsightView,
    // Generic event tracking
    trackEvent,
    trackUserInteraction,
    trackBusinessGoal,
    trackMiningEvent
  }
}

export default useAnalytics
