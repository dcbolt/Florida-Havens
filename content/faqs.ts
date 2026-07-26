/**
 * FAQ content lifted verbatim from the live Wix /faqs page (21 entries).
 *
 * AUDIT FIX: the live page renders these inside the Wix FAQ widget with no
 * FAQPage structured data, so none of them are eligible for FAQ rich results.
 * Rendering them as real markup + JSON-LD makes them indexable and eligible.
 *
 * NOTE: answers that pointed guests at Wi-Fi / check-in / house-manual pages
 * now point at the Media Haven guest portal, per the marketing/in-stay split.
 */
export type Faq = { q: string; a: string }

export const FAQS: Faq[] = [
  {
    q: 'Is it possible to request an early check-in or late check-out?',
    a:
      'Yes, you can request an early check-in or late check-out, depending on availability. Just let us know when booking, and we\'ll confirm as soon as we can. More details are in our Guidebook.',
  },
  {
    q: 'Are the pools private or shared?',
    a:
      'Each villa offers a private pool and spa, ensuring you enjoy exclusive and tranquil swimming experiences without sharing with other guests. Our pool rules emphasize safety and cleanliness to maintain a serene environment for your personal relaxation. You can fully unwind knowing your pool time is reserved just for you and your party.',
  },
  {
    q: 'Are pets allowed at the villas?',
    a:
      'No, pets aren\'t allowed at our villas to help preserve the beauty of the area and respect the sea turtle reserve. For your convenience, our Guidebook lists nearby pet-friendly boarding options.',
  },
  {
    q: 'Is smoking or vaping allowed at the villas?',
    a:
      'No, smoking and vaping aren\'t allowed at our villas. We maintain a smoke-free environment to ensure a fresh and enjoyable stay for everyone. Check out our House Rules for more details.',
  },
  {
    q: 'What dining options are available close by?',
    a:
      'Savor a range of culinary delights, from the laid-back charm of Drifters Surf Resto to the refined elegance of Ocean 302. Our dining guide curates the best nearby spots for family meals, ensuring every taste is satisfied. We have a full list of recommendations for dining in and out.',
  },
  {
    q: 'Do the properties have high-speed Wi-Fi?',
    a:
      'Stay effortlessly connected with high-speed Wi-Fi in every villa, perfect for work or streaming family movie nights on our large 85" TVs. Your login details await upon arrival, with more in our Guidebook.',
  },
  {
    q: 'Can we host a small gathering or party?',
    a:
      'Our havens are designed for intimate family retreats, so parties and events are not permitted to preserve the peaceful ambiance of our beachfront reserve. Our House Rules ensure a restful experience for all.',
  },
  {
    q: 'Are there EV charging stations?',
    a:
      'Embrace eco-friendly travel with EV chargers at each villa, seamlessly integrated for your convenience. Our Guidebook provides all the details for a sustainable, luxurious stay.',
  },
  {
    q: 'What amenities are provided for kids?',
    a:
      'Delight in family-friendly touches like sand toys and boogie boards (at select properties), plus spacious layouts for playtime. Nearby playgrounds add to the joy, as outlined in our Guidebook and activities guide.',
  },
  {
    q: 'What should we know about beach safety and wildlife?',
    a:
      'Our private beach invites adventure but is unguarded, so please supervise children and stay mindful of rip currents. Respect wildlife, especially jelly fish and sea turtles during nesting season, by keeping your distance. Our Guidebook shares essential tips for a safe, magical experience.',
  },
  {
    q: 'Can we request private beach yoga sessions?',
    a:
      'Elevate your retreat with private beach yoga, arranged upon request. Simply include it in your reservation notes for a serene, soulful addition to your luxurious escape.',
  },
  {
    q: 'What should I do if I need help during my stay?',
    a:
      'If you need help during your stay, just reach out to our 24/7 support team using the contact details in your booking confirmation. We\'re here to make sure your experience is comfortable and enjoyable.',
  },
  {
    q: 'How do I check-in to the property?',
    a:
      'Check-in is seamless with our keyless entry system. You will receive a unique code via email 24 hours before your arrival. Detailed instructions are provided in our welcome guide.',
  },
  {
    q: 'What amenities are included in the rental?',
    a:
      'Our rentals come fully equipped with modern amenities including high-speed Wi-Fi, a fully stocked kitchen, private pool, and beach access. A complete list of amenities is available in the property description.',
  },
  {
    q: 'Are there any house rules I should be aware of?',
    a:
      'Yes, we have a few house rules to ensure a pleasant stay for all guests. These include no smoking, no pets, and quiet hours from 10 PM to 8 AM. A full list of house rules is provided in the welcome guide.',
  },
  {
    q: 'How long does it take to get to Orlando\'s theme parks from the villas?',
    a:
      'Orlando\'s theme parks, like Disney World, are just about 1 hour and 15 minutes away from our villas—perfect for a fun day trip! Check out our activities guide for more tips.',
  },
  {
    q: 'Can we host a wedding or special event at the property?',
    a:
      'While our villas are ideal for intimate family celebrations, larger events like weddings require prior approval to maintain the peaceful ambiance of our reserve. Please consult our House Rules and note your request when booking for personalized guidance.',
  },
  {
    q: 'Is fishing allowed on the private beach?',
    a:
      'Delight in the thrill of fishing from our exclusive beachfront, a favorite for creating lasting memories. Our Guidebook shares tips on local regulations and best practices to respect the sea turtle habitat during your surf-casting adventure.',
  },
  {
    q: 'Are beach chairs and umbrellas provided?',
    a:
      'Absolutely, we supply comfortable beach chairs and umbrellas for your convenience, allowing you to bask in the sun or shade with ease. Additional sand toys and boogie boards are available at certain properties, as noted in our Guidebook.',
  },
  {
    q: 'Are the kitchens fully equipped for cooking family meals?',
    a:
      'Our gourmet kitchens are fully stocked with modern appliances, cookware, and utensils, ready for you to prepare delightful family feasts. From blenders to coffee makers, our Guidebook lists everything provided for your culinary convenience.',
  },
  {
    q: 'How accessible are the properties for guests with mobility needs?',
    a:
      'While our villas feature spacious layouts, please note that full wheelchair accessibility may vary by property. We recommend reviewing our Guidebook for specifics and contacting us to discuss accommodations for a comfortable stay. BOOK TODAY FAQS TERMS PRIVACY REFUNDS ACCESSIBILITY The Florida Havens are a collection of private beachfront homes & villas along Florida’s Space Coast — where family memories meet coastal luxury. THE HAVENS AT BEACH ST: Indialantic, FL 32903 THE HAVENS AT THE DUNES:',
  },
]
