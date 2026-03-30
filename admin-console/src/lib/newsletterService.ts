const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8787').replace(/\/$/, '');

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'active' | 'inactive' | 'unsubscribed';
}

/**
 * Get all newsletter subscribers
 */
export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/newsletter/subscribers`);
    const data = await response.json();

    if (!response.ok) {
      return [];
    }

    return (data?.subscribers || []) as NewsletterSubscriber[];
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    return [];
  }
}

/**
 * Delete a newsletter subscriber
 */
export async function deleteNewsletterSubscriber(id: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/newsletter/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return { success: false, error };
  }
}

/**
 * Get active subscriber count
 */
export async function getActiveSubscriberCount(): Promise<number> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/newsletter/active-count`);
    const data = await response.json();
    if (!response.ok) {
      return 0;
    }
    return Number(data?.count || 0);
  } catch (error) {
    console.error("Error getting subscriber count:", error);
    return 0;
  }
}
