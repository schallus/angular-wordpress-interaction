export class Post {
    title: string;
    content: string;
    author?: number;
    date?: Date;
    modified?: Date;
    slug?: string;
    status?: string;
    excerpt?: string;
    featured_media?: number;
    categories?: number[];
    tags?: number[];
}
