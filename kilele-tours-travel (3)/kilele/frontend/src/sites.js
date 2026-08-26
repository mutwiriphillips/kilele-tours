// Curated catalogue of Kenya tour sites for the itinerary planner.
// Descriptions are brief, original summaries — not sourced verbatim from any site.

export const siteCategories = [
  { id: "safari", label: "Safari & Wildlife" },
  { id: "rift", label: "Mountains & Rift Valley" },
  { id: "coast", label: "Coast & Marine" },
  { id: "culture", label: "Culture & Heritage" }
];

export const sites = [
  {
    id: "maasai-mara",
    name: "Maasai Mara National Reserve",
    category: "safari",
    region: "Narok County",
    description:
      "Kenya's best-known reserve, home to the Great Migration and reliable Big Five sightings year-round. The obvious first stop for a first safari.",
    tag: "Most requested"
  },
  {
    id: "amboseli",
    name: "Amboseli National Park",
    category: "safari",
    region: "Kajiado County",
    description:
      "Large elephant herds against the backdrop of Mount Kilimanjaro. A favourite for photographers chasing that exact shot.",
    tag: "Photographers' favourite"
  },
  {
    id: "tsavo-east",
    name: "Tsavo East National Park",
    category: "safari",
    region: "Taita-Taveta / Kitui",
    description:
      "One of Kenya's largest parks, known for its red-dust elephants and vast open wilderness. Feels remote even close to the coast.",
    tag: null
  },
  {
    id: "tsavo-west",
    name: "Tsavo West National Park",
    category: "safari",
    region: "Taita-Taveta County",
    description:
      "Volcanic hills, natural springs, and dramatic lava landscapes alongside the wildlife — a more rugged safari than its eastern half.",
    tag: null
  },
  {
    id: "samburu",
    name: "Samburu National Reserve",
    category: "safari",
    region: "Samburu County",
    description:
      "Northern Kenya's arid-country reserve, home to species you won't see further south — Grevy's zebra, reticulated giraffe, gerenuk.",
    tag: "Off the beaten path"
  },
  {
    id: "lake-nakuru",
    name: "Lake Nakuru National Park",
    category: "safari",
    region: "Nakuru County",
    description:
      "A compact rift valley park built around a soda lake, known for both black and white rhino and, seasonally, dense flamingo flocks.",
    tag: null
  },
  {
    id: "nairobi-np",
    name: "Nairobi National Park",
    category: "safari",
    region: "Nairobi",
    description:
      "A working safari with the city skyline in the frame — genuinely useful when a client has only a few hours between flights.",
    tag: "Good for layovers"
  },
  {
    id: "aberdare",
    name: "Aberdare National Park",
    category: "safari",
    region: "Nyeri / Nyandarua",
    description:
      "Highland moorland and dense forest rather than open plains — waterfalls, elephants, and the region's famous tree-hotel lodges.",
    tag: null
  },
  {
    id: "ol-pejeta",
    name: "Ol Pejeta Conservancy",
    category: "safari",
    region: "Laikipia County",
    description:
      "A private conservancy built around rhino protection, including the world's last northern white rhinos. Strong for a conservation-minded client.",
    tag: null
  },
  {
    id: "mount-kenya",
    name: "Mount Kenya National Park",
    category: "rift",
    region: "Central Kenya",
    description:
      "Africa's second-highest peak, with trekking routes ranging from a day hike to a multi-day summit attempt.",
    tag: null
  },
  {
    id: "hells-gate",
    name: "Hell's Gate National Park",
    category: "rift",
    region: "Naivasha, Nakuru County",
    description:
      "One of the few Kenyan parks safe for cycling and walking among wildlife — dramatic gorges and towering cliffs.",
    tag: null
  },
  {
    id: "lake-naivasha",
    name: "Lake Naivasha",
    category: "rift",
    region: "Nakuru County",
    description:
      "A freshwater rift valley lake for boat rides close to hippos and birdlife, an easy add-on near Hell's Gate.",
    tag: null
  },
  {
    id: "diani",
    name: "Diani Beach",
    category: "coast",
    region: "Kwale County",
    description:
      "White sand and clear water south of Mombasa — Kenya's most established beach resort strip, good for a stay after a safari.",
    tag: "Popular add-on"
  },
  {
    id: "watamu",
    name: "Watamu Marine National Park",
    category: "coast",
    region: "Kilifi County",
    description:
      "Protected coral reefs and calmer water than the open coast — reliable for snorkelling and diving.",
    tag: null
  },
  {
    id: "lamu",
    name: "Lamu Old Town",
    category: "culture",
    region: "Lamu County",
    description:
      "A UNESCO World Heritage Swahili settlement — narrow streets, no cars, centuries of coastal trading history.",
    tag: "UNESCO site"
  },
  {
    id: "fort-jesus",
    name: "Fort Jesus, Mombasa",
    category: "culture",
    region: "Mombasa",
    description:
      "A 16th-century Portuguese fort overlooking Mombasa's Old Town harbour, now a museum on the coast's layered history.",
    tag: "UNESCO site"
  }
];

export function siteById(id) {
  return sites.find((s) => s.id === id);
}
