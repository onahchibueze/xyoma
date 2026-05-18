export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export const features: FeatureItem[] = [
  {
    id: "01",
    title: "Precision Cut",
    description: "A high-fashion studio portrait capturing a model in sharp, architectural tailoring with dramatic lighting.",
    imageUrl: "/images/high-fashion-portrait-01.jpeg",
    imageAlt: "High-fashion studio portrait in architectural tailoring",
  },
  {
    id: "02",
    title: "Premium Tech",
    description: "Futuristic fashion editorial showcasing technical streetwear textures and avant-garde urban silhouettes.",
    imageUrl: "/images/fashion-editorial-01.jpeg",
    imageAlt: "Futuristic fashion editorial with technical textures",
  },
  {
    id: "03",
    title: "Cultural Core",
    description: "An elegant studio capture of a Nigerian model, merging traditional heritage with modern fashion minimalism.",
    imageUrl: "/images/african-model-studio.jpeg",
    imageAlt: "Nigerian model in a minimalist fashion studio setting",
  },
  {
    id: "04",
    title: "Limited Drops",
    description: "Editorial streetwear showcase featuring premium oversized pieces and bold contemporary style statements.",
    imageUrl: "/images/luxury-african.jpeg",
    imageAlt: "Editorial streetwear showcase for limited drops",
  },
];
