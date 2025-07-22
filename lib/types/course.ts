export interface Course {
  id?: string;                  
  title: string;
  author: string;
  track: string;
  description: string;
  picture?: string;             
  dateCreated?: string;        
  status?: "active" | "inactive" | "draft";
}
