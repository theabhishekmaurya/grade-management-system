// Event tracking hook for user actions
// This would integrate with analytics services like Google Analytics, Mixpanel, etc.

export interface EventData {
  action: string;
  category: string;
  label?: string;
  value?: number;
  userId?: string;
  timestamp?: number;
}

class EventTracker {
  private events: EventData[] = [];
  
  track(eventData: EventData) {
    const event = {
      ...eventData,
      timestamp: Date.now()
    };
    
    this.events.push(event);
    
    // Log to console for development
    console.log('📊 Event Tracked:', event);
    
    // In production, you would send this to your analytics service
    // Example: Google Analytics, Mixpanel, Custom Analytics API
    this.sendToAnalytics(event);
  }
  
  private sendToAnalytics(event: EventData) {
    // Placeholder for analytics integration
    // Example implementations:
    
    // Google Analytics 4
    // gtag('event', event.action, {
    //   event_category: event.category,
    //   event_label: event.label,
    //   value: event.value
    // });
    
    // Custom API
    // fetch('/api/analytics/track', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event)
    // });
  }
  
  getEvents() {
    return this.events;
  }
  
  clearEvents() {
    this.events = [];
  }
}

const eventTracker = new EventTracker();

export function useEventTracking() {
  const trackEvent = (eventData: Omit<EventData, 'timestamp'>) => {
    eventTracker.track(eventData);
  };

  // Pre-defined tracking functions for common actions
  const trackSubjectAction = (action: string, subjectName?: string) => {
    trackEvent({
      action,
      category: 'Subject',
      label: subjectName
    });
  };

  const trackCompetencyAction = (action: string, competencyName?: string, marks?: number) => {
    trackEvent({
      action,
      category: 'Competency', 
      label: competencyName,
      value: marks
    });
  };

  const trackUIAction = (action: string, element?: string) => {
    trackEvent({
      action,
      category: 'UI',
      label: element
    });
  };

  return {
    trackEvent,
    trackSubjectAction,
    trackCompetencyAction,
    trackUIAction,
    getEvents: () => eventTracker.getEvents(),
    clearEvents: () => eventTracker.clearEvents()
  };
}