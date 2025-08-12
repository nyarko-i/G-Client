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
export interface Track {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  instructor: string;
  image: string;
}
