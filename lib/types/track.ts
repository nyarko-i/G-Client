export interface TrackData {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  instructor: string;
  students: number;
  rating: number;
  technologies: string[];
  status: "active" | "inactive" | "draft";
}
