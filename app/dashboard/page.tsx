"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  Target,
  Plus,
  Camera,
  BookOpen,
  Search,
  Bell,
  Heart,
  MessageCircle,
  Share,
  Trophy,
  Star,
  MapPin,
  X,
  ImageIcon,
  Video,
  Send,
  ExternalLink,
  Filter,
  ArrowLeft,
  Play,
  Recycle,
  TreePine,
} from "lucide-react"

interface DashboardUser {
  id: number
  name: string
  email: string
  avatar: string
  points: number
  posts: Post[]
  completedMissions: number[]
  likedPosts: number[]
  likedComments: number[]
  bio?: string
  location?: string
  joinDate?: string
}

interface Post {
  id: number
  userId: number
  userName: string
  userAvatar: string
  content: string
  image?: string
  video?: string
  topic: string
  likes: number
  comments: number
  timestamp: string
  likedBy?: number[]
  commentsList?: Comment[]
}

interface Comment {
  id: number
  userId: number
  userName: string
  userAvatar: string
  content: string
  timestamp: string
  likes: number
  likedBy: number[]
}

interface Mission {
  id: number
  title: string
  description: string
  points: number
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  completedBy: number[]
  steps?: string[]
  requirements?: string[]
  deadline?: string
  proofRequired?: boolean
  image?: string
}

interface Article {
  id: number
  title: string
  province: string
  category: string
  excerpt: string
  image: string
  content?: string
  author?: string
  date?: string
  readTime?: string
}

interface Notification {
  id: number
  type: "like" | "comment" | "mission" | "follow"
  message: string
  timestamp: string
  read: boolean
  avatar?: string
}

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<DashboardUser | null>(null)
  const [activeTab, setActiveTab] = useState("beranda")
  const [posts, setPosts] = useState<Post[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [newPost, setNewPost] = useState({ content: "", topic: "lingkungan", image: "", video: "" })
  const [selectedProvince, setSelectedProvince] = useState("semua")
  const [selectedCategory, setSelectedCategory] = useState("semua")
  const [showSearch, setShowSearch] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [isVideo, setIsVideo] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [newComment, setNewComment] = useState("")
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [missionProof, setMissionProof] = useState<File | null>(null)
  const [missionProofPreview, setMissionProofPreview] = useState<string>("")
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [sharePostId, setSharePostId] = useState<number | null>(null)
  const [selectedUser, setSelectedUser] = useState<DashboardUser | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchType, setSearchType] = useState<"posts" | "users" | "articles">("posts")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const missionProofRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const provinces = [
    "Semua",
    "Aceh",
    "Sumatera Utara",
    "Sumatera Barat",
    "Riau",
    "Kepulauan Riau",
    "Jambi",
    "Sumatera Selatan",
    "Bangka Belitung",
    "Bengkulu",
    "Lampung",
    "DKI Jakarta",
    "Jawa Barat",
    "Jawa Tengah",
    "DI Yogyakarta",
    "Jawa Timur",
    "Banten",
    "Bali",
    "Nusa Tenggara Barat",
    "Nusa Tenggara Timur",
    "Kalimantan Barat",
    "Kalimantan Tengah",
    "Kalimantan Selatan",
    "Kalimantan Timur",
    "Kalimantan Utara",
    "Sulawesi Utara",
    "Sulawesi Tengah",
    "Sulawesi Selatan",
    "Sulawesi Tenggara",
    "Gorontalo",
    "Sulawesi Barat",
    "Maluku",
    "Maluku Utara",
    "Papua",
    "Papua Barat",
  ]

  const categories = ["Semua", "Lingkungan", "Hewan", "Tumbuhan"]

  const postTopics = [
    "lingkungan",
    "polusi",
    "hewan",
    "tumbuhan",
    "daur ulang",
    "energi terbarukan",
    "perubahan iklim",
    "konservasi",
    "sampah plastik",
    "penghijauan",
  ]

  const samplePosts: Post[] = [
    {
      id: 1,
      userId: 1,
      userName: "Andi Pratama",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content:
        "Hari ini saya ikut kegiatan bersih-bersih pantai di Ancol. Mari kita jaga kebersihan laut Indonesia! 🌊 #BersihPantai #LautBersih",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=400&fit=crop",
      topic: "lingkungan",
      likes: 24,
      comments: 8,
      timestamp: "2 jam yang lalu",
      likedBy: [],
      commentsList: [
        {
          id: 1,
          userId: 2,
          userName: "Sari Dewi",
          userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          content: "Keren banget! Kapan ada lagi kegiatan seperti ini?",
          timestamp: "1 jam yang lalu",
          likes: 5,
          likedBy: [],
        },
      ],
    },
    {
      id: 2,
      userId: 2,
      userName: "Sari Dewi",
      userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      content: "Menemukan burung langka di hutan dekat rumah. Kita harus melindungi habitat mereka! 🐦",
      image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&h=400&fit=crop",
      topic: "hewan",
      likes: 18,
      comments: 5,
      timestamp: "4 jam yang lalu",
      likedBy: [],
      commentsList: [],
    },
    {
      id: 3,
      userId: 3,
      userName: "Budi Santoso",
      userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "Video tutorial cara membuat kompos dari sampah organik rumah tangga. Yuk kita mulai dari hal kecil! ♻️",
      video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      topic: "daur ulang",
      likes: 32,
      comments: 12,
      timestamp: "6 jam yang lalu",
      likedBy: [],
      commentsList: [],
    },
    {
      id: 4,
      userId: 4,
      userName: "Maya Sari",
      userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "Polusi udara di Jakarta semakin parah. Kita perlu lebih banyak transportasi ramah lingkungan! 🚲🌱",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      topic: "polusi",
      likes: 45,
      comments: 18,
      timestamp: "8 jam yang lalu",
      likedBy: [],
      commentsList: [],
    },
    {
      id: 5,
      userId: 5,
      userName: "Rizki Pratama",
      userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      content:
        "Menanam 50 bibit pohon di area yang gundul. Setiap pohon adalah harapan untuk masa depan yang lebih hijau! 🌳",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
      topic: "penghijauan",
      likes: 67,
      comments: 23,
      timestamp: "12 jam yang lalu",
      likedBy: [],
      commentsList: [],
    },
    {
      id: 6,
      userId: 6,
      userName: "Dewi Lestari",
      userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      content:
        "Panel surya di rumah sudah terpasang! Energi terbarukan adalah masa depan. Mari beralih ke energi bersih! ☀️⚡",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop",
      topic: "energi terbarukan",
      likes: 38,
      comments: 14,
      timestamp: "1 hari yang lalu",
      likedBy: [],
      commentsList: [],
    },
    {
      id: 7,
      userId: 7,
      userName: "Ahmad Fauzi",
      userAvatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
      content:
        "Dampak perubahan iklim sudah sangat terasa. Es di kutub mencair dengan cepat. Kita harus bertindak sekarang! 🌍❄️",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      topic: "perubahan iklim",
      likes: 52,
      comments: 28,
      timestamp: "1 hari yang lalu",
      likedBy: [],
      commentsList: [],
    },
    {
      id: 8,
      userId: 8,
      userName: "Lina Marlina",
      userAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      content:
        "Konservasi penyu di pantai Sukamade. Setiap telur yang menetas adalah harapan bagi kelestarian spesies ini! 🐢",
      video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
      topic: "konservasi",
      likes: 73,
      comments: 31,
      timestamp: "2 hari yang lalu",
      likedBy: [],
      commentsList: [],
    },
    {
      id: 9,
      userId: 9,
      userName: "Fajar Nugroho",
      userAvatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
      content:
        "Kampanye anti plastik sekali pakai di kampus. Sudah saatnya kita beralih ke alternatif yang ramah lingkungan! 🥤➡️🌿",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop",
      topic: "sampah plastik",
      likes: 41,
      comments: 19,
      timestamp: "2 hari yang lalu",
      likedBy: [],
      commentsList: [],
    },
    {
      id: 10,
      userId: 10,
      userName: "Indira Sari",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      content:
        "Kebun vertikal di balkon apartemen. Ruang kecil bukan halangan untuk berkebun dan menghijaukan lingkungan! 🌱🏢",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
      topic: "tumbuhan",
      likes: 29,
      comments: 11,
      timestamp: "3 hari yang lalu",
      likedBy: [],
      commentsList: [],
    },
  ]

  const sampleMissions: Mission[] = [
    {
      id: 1,
      title: "Bersihkan 10 Sampah Plastik",
      description: "Kumpulkan dan buang 10 sampah plastik di area sekitar rumah Anda",
      points: 50,
      difficulty: "Easy",
      category: "Kebersihan",
      completedBy: [],
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop",
      steps: [
        "Siapkan sarung tangan dan kantong sampah",
        "Cari area yang banyak sampah plastik",
        "Kumpulkan minimal 10 sampah plastik",
        "Buang ke tempat sampah yang sesuai",
        "Foto sebagai bukti penyelesaian",
      ],
      requirements: ["Sarung tangan", "Kantong sampah", "Kamera untuk dokumentasi"],
      deadline: "7 hari",
      proofRequired: true,
    },
    {
      id: 2,
      title: "Tanam 1 Pohon",
      description: "Tanam satu pohon di area yang membutuhkan penghijauan",
      points: 100,
      difficulty: "Medium",
      category: "Penghijauan",
      completedBy: [],
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
      steps: [
        "Pilih bibit pohon yang sesuai dengan iklim",
        "Cari lokasi yang tepat untuk menanam",
        "Gali lubang dengan kedalaman yang cukup",
        "Tanam bibit dengan hati-hati",
        "Siram dan rawat pohon secara rutin",
      ],
      requirements: ["Bibit pohon", "Sekop", "Air untuk menyiram"],
      deadline: "14 hari",
      proofRequired: true,
    },
    {
      id: 3,
      title: "Buat Kompos Organik",
      description: "Buat kompos dari sampah organik rumah tangga selama 1 minggu",
      points: 75,
      difficulty: "Medium",
      category: "Daur Ulang",
      completedBy: [],
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
      steps: [
        "Kumpulkan sampah organik (sisa sayuran, buah)",
        "Siapkan wadah kompos",
        "Campurkan dengan tanah dan dedaunan kering",
        "Aduk secara berkala",
        "Tunggu hingga menjadi kompos (1-2 minggu)",
      ],
      requirements: ["Wadah kompos", "Sampah organik", "Tanah", "Dedaunan kering"],
      deadline: "21 hari",
      proofRequired: true,
    },
    {
      id: 4,
      title: "Hemat Air 1 Minggu",
      description: "Lakukan penghematan air di rumah selama 1 minggu dan catat penggunaannya",
      points: 60,
      difficulty: "Easy",
      category: "Konservasi",
      completedBy: [],
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      steps: [
        "Catat penggunaan air harian sebelum penghematan",
        "Terapkan tips hemat air (mandi lebih singkat, tutup keran)",
        "Catat penggunaan air setelah penghematan",
        "Bandingkan hasil sebelum dan sesudah",
        "Dokumentasikan dengan foto meteran air",
      ],
      requirements: ["Buku catatan", "Kamera", "Komitmen untuk berhemat"],
      deadline: "10 hari",
      proofRequired: true,
    },
    {
      id: 5,
      title: "Edukasi 5 Orang tentang Lingkungan",
      description: "Berikan edukasi kepada 5 orang tentang pentingnya menjaga lingkungan",
      points: 150,
      difficulty: "Hard",
      category: "Edukasi",
      completedBy: [],
      image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop",
      steps: [
        "Siapkan materi edukasi tentang lingkungan",
        "Cari 5 orang yang bersedia mendengarkan",
        "Berikan edukasi dengan cara yang menarik",
        "Minta feedback dari mereka",
        "Dokumentasikan kegiatan edukasi",
      ],
      requirements: ["Materi edukasi", "Kemampuan komunikasi", "Kamera untuk dokumentasi"],
      deadline: "14 hari",
      proofRequired: true,
    },
    {
      id: 6,
      title: "Gunakan Transportasi Ramah Lingkungan",
      description: "Gunakan sepeda atau transportasi umum selama 1 minggu",
      points: 80,
      difficulty: "Medium",
      category: "Transportasi",
      completedBy: [],
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      steps: [
        "Rencanakan rute perjalanan dengan transportasi ramah lingkungan",
        "Gunakan sepeda atau transportasi umum",
        "Catat jarak dan waktu perjalanan",
        "Hitung pengurangan emisi karbon",
        "Dokumentasikan perjalanan",
      ],
      requirements: ["Sepeda atau akses transportasi umum", "Aplikasi tracking", "Kamera"],
      deadline: "10 hari",
      proofRequired: true,
    },
    {
      id: 7,
      title: "Bersihkan Sungai atau Pantai",
      description: "Ikut serta dalam kegiatan bersih-bersih sungai atau pantai",
      points: 120,
      difficulty: "Medium",
      category: "Kebersihan",
      completedBy: [],
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop",
      steps: [
        "Cari kegiatan bersih-bersih di area sekitar",
        "Daftar sebagai volunteer",
        "Ikuti kegiatan dengan antusias",
        "Kumpulkan sampah sesuai target",
        "Dokumentasikan kegiatan",
      ],
      requirements: ["Sarung tangan", "Kantong sampah", "Semangat volunteer"],
      deadline: "21 hari",
      proofRequired: true,
    },
    {
      id: 8,
      title: "Buat Produk Daur Ulang",
      description: "Buat produk berguna dari barang bekas (botol plastik, kardus, dll)",
      points: 90,
      difficulty: "Medium",
      category: "Kreativitas",
      completedBy: [],
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop",
      steps: [
        "Kumpulkan barang bekas yang masih bisa digunakan",
        "Rencanakan produk yang akan dibuat",
        "Buat produk dengan kreativitas",
        "Test fungsi produk yang dibuat",
        "Dokumentasikan proses dan hasil",
      ],
      requirements: ["Barang bekas", "Alat craft", "Kreativitas", "Kamera"],
      deadline: "14 hari",
      proofRequired: true,
    },
    {
      id: 9,
      title: "Hemat Listrik 1 Bulan",
      description: "Lakukan penghematan listrik di rumah selama 1 bulan",
      points: 200,
      difficulty: "Hard",
      category: "Energi",
      completedBy: [],
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop",
      steps: [
        "Catat penggunaan listrik bulan sebelumnya",
        "Terapkan tips hemat listrik",
        "Gunakan lampu LED dan cabut peralatan tidak terpakai",
        "Monitor penggunaan harian",
        "Bandingkan tagihan listrik",
      ],
      requirements: ["Meteran listrik", "Lampu LED", "Disiplin tinggi"],
      deadline: "35 hari",
      proofRequired: true,
    },
  ]

  const articles = [
    {
      id: 1,
      title: "Krisis Air Bersih di Jakarta",
      province: "DKI Jakarta",
      category: "Lingkungan",
      excerpt: "Penurunan kualitas air tanah di Jakarta mencapai tingkat yang mengkhawatirkan...",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=400&fit=crop",
      author: "Dr. Budi Santoso",
      date: "12 Juni 2023",
      readTime: "5 menit",
      content: `
        <h2>Krisis Air Bersih di Jakarta</h2>
        <p>Jakarta, ibu kota Indonesia, sedang menghadapi krisis air bersih yang semakin mengkhawatirkan...</p>
      `,
    },
    {
      id: 2,
      title: "Deforestasi Hutan Kalimantan",
      province: "Kalimantan Timur",
      category: "Lingkungan",
      excerpt: "Laju deforestasi di Kalimantan terus meningkat akibat ekspansi perkebunan...",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
      author: "Prof. Siti Nurhaliza",
      date: "8 Juni 2023",
      readTime: "7 menit",
      content: `<h2>Deforestasi Hutan Kalimantan</h2><p>Hutan Kalimantan menghadapi ancaman serius...</p>`,
    },
    {
      id: 3,
      title: "Pencemaran Laut di Bali",
      province: "Bali",
      category: "Lingkungan",
      excerpt: "Sampah plastik mengancam ekosistem laut dan pariwisata Bali...",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
      author: "Dr. Made Sutrisna",
      date: "5 Juni 2023",
      readTime: "6 menit",
      content: `<h2>Pencemaran Laut di Bali</h2><p>Pulau Bali menghadapi masalah pencemaran laut...</p>`,
    },
    {
      id: 4,
      title: "Konservasi Orangutan Sumatera",
      province: "Sumatera Utara",
      category: "Hewan",
      excerpt: "Upaya pelestarian orangutan Sumatera yang terancam punah...",
      image: "https://images.unsplash.com/photo-1605656816944-971cd5c1407f?w=600&h=400&fit=crop",
      author: "Dr. Rahmat Hidayat",
      date: "3 Juni 2023",
      readTime: "8 menit",
      content: `<h2>Konservasi Orangutan Sumatera</h2><p>Orangutan Sumatera adalah spesies yang terancam punah...</p>`,
    },
    {
      id: 5,
      title: "Pelestarian Harimau Jawa",
      province: "Jawa Tengah",
      category: "Hewan",
      excerpt: "Upaya terakhir menyelamatkan harimau Jawa dari kepunahan...",
      image: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=600&h=400&fit=crop",
      author: "Prof. Slamet Riyadi",
      date: "1 Juni 2023",
      readTime: "9 menit",
      content: `<h2>Pelestarian Harimau Jawa</h2><p>Harimau Jawa adalah subspesies harimau yang sangat langka...</p>`,
    },
    {
      id: 6,
      title: "Konservasi Penyu di Pantai Sukamade",
      province: "Jawa Timur",
      category: "Hewan",
      excerpt: "Program konservasi penyu hijau di Taman Nasional Meru Betiri...",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
      author: "Drs. Bambang Supriyanto",
      date: "28 Mei 2023",
      readTime: "6 menit",
      content: `<h2>Konservasi Penyu di Pantai Sukamade</h2><p>Pantai Sukamade adalah salah satu tempat bertelur penyu...</p>`,
    },
    {
      id: 7,
      title: "Pelestarian Bunga Rafflesia",
      province: "Sumatera Barat",
      category: "Tumbuhan",
      excerpt: "Upaya melestarikan bunga terbesar di dunia yang terancam punah...",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
      author: "Dr. Fitri Yanti",
      date: "25 Mei 2023",
      readTime: "7 menit",
      content: `<h2>Pelestarian Bunga Rafflesia</h2><p>Rafflesia adalah bunga terbesar di dunia...</p>`,
    },
    {
      id: 8,
      title: "Konservasi Hutan Mangrove",
      province: "Kalimantan Selatan",
      category: "Tumbuhan",
      excerpt: "Pentingnya hutan mangrove untuk ekosistem pesisir...",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
      author: "Prof. Agus Salim",
      date: "22 Mei 2023",
      readTime: "8 menit",
      content: `<h2>Konservasi Hutan Mangrove</h2><p>Hutan mangrove memiliki peran penting...</p>`,
    },
    {
      id: 9,
      title: "Budidaya Tanaman Endemik Papua",
      province: "Papua",
      category: "Tumbuhan",
      excerpt: "Upaya pelestarian tanaman endemik Papua yang unik...",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
      author: "Dr. Maria Wambrauw",
      date: "20 Mei 2023",
      readTime: "6 menit",
      content: `<h2>Budidaya Tanaman Endemik Papua</h2><p>Papua memiliki keanekaragaman hayati yang luar biasa...</p>`,
    },
    {
      id: 10,
      title: "Restorasi Terumbu Karang Bunaken",
      province: "Sulawesi Utara",
      category: "Lingkungan",
      excerpt: "Program restorasi terumbu karang di Taman Nasional Bunaken...",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
      author: "Dr. Ricky Lasut",
      date: "18 Mei 2023",
      readTime: "7 menit",
      content: `<h2>Restorasi Terumbu Karang Bunaken</h2><p>Terumbu karang Bunaken menghadapi ancaman...</p>`,
    },
    {
      id: 11,
      title: "Polusi Udara di Surabaya",
      province: "Jawa Timur",
      category: "Lingkungan",
      excerpt: "Dampak polusi udara terhadap kesehatan masyarakat Surabaya...",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      author: "Dr. Andi Kurniawan",
      date: "15 Mei 2023",
      readTime: "5 menit",
      content: `<h2>Polusi Udara di Surabaya</h2><p>Kualitas udara di Surabaya semakin memburuk...</p>`,
    },
    {
      id: 12,
      title: "Konservasi Burung Cendrawasih",
      province: "Papua Barat",
      category: "Hewan",
      excerpt: "Upaya melindungi burung cendrawasih dari perburuan liar...",
      image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&h=400&fit=crop",
      author: "Prof. John Wanma",
      date: "12 Mei 2023",
      readTime: "8 menit",
      content: `<h2>Konservasi Burung Cendrawasih</h2><p>Burung cendrawasih adalah ikon Papua...</p>`,
    },
  ]

  const sampleNotifications: Notification[] = [
    {
      id: 1,
      type: "like",
      message: "Andi Pratama menyukai postingan Anda",
      timestamp: "5 menit yang lalu",
      read: false,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 2,
      type: "comment",
      message: "Sari Dewi mengomentari postingan Anda",
      timestamp: "10 menit yang lalu",
      read: false,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 3,
      type: "mission",
      message: "Selamat! Anda telah menyelesaikan misi 'Bersihkan 10 Sampah Plastik'",
      timestamp: "1 jam yang lalu",
      read: true,
    },
    {
      id: 4,
      type: "follow",
      message: "Budi Santoso mulai mengikuti Anda",
      timestamp: "2 jam yang lalu",
      read: true,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
  ]

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/")
      return
    }

    const userData = JSON.parse(user)
    setCurrentUser({
      ...userData,
      likedPosts: userData.likedPosts || [],
      likedComments: userData.likedComments || [],
      bio: userData.bio || "Pecinta lingkungan yang ingin berkontribusi untuk bumi yang lebih hijau 🌱",
      location: userData.location || "Jakarta, Indonesia",
      joinDate: userData.joinDate || "Bergabung Juni 2023",
    })

    setPosts(samplePosts)
    setMissions(sampleMissions)
    setNotifications(sampleNotifications)
  }, [router])

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = []

      if (searchType === "posts") {
        const filteredPosts = samplePosts.filter(
          (post) =>
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.userName.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        results.push(...filteredPosts)
      } else if (searchType === "users") {
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const filteredUsers = users.filter((user: DashboardUser) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        results.push(...filteredUsers)
      } else if (searchType === "articles") {
        const filteredArticles = articles.filter(
          (article) =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.category.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        results.push(...filteredArticles)
      }

      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, searchType])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    const isVideoFile = file.type.startsWith("video/")
    setIsVideo(isVideoFile)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    if (isVideoFile) {
      setNewPost({ ...newPost, video: url, image: "" })
    } else {
      setNewPost({ ...newPost, image: url, video: "" })
    }
  }

  const handleCreatePost = () => {
    if (!currentUser || !newPost.content) return

    const post: Post = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: newPost.content,
      topic: newPost.topic,
      likes: 0,
      comments: 0,
      timestamp: "Baru saja",
      likedBy: [],
      commentsList: [],
    }

    if (newPost.image) post.image = newPost.image
    if (newPost.video) post.video = newPost.video

    setPosts([post, ...posts])
    setNewPost({ content: "", topic: "lingkungan", image: "", video: "" })
    setSelectedFile(null)
    setPreviewUrl("")
    setIsVideo(false)
    setActiveTab("beranda")
  }

  const handleLike = (postId: number) => {
    if (!currentUser) return

    const userLikedPosts = currentUser.likedPosts || []
    const hasLiked = userLikedPosts.includes(postId)

    if (hasLiked) {
      const updatedLikedPosts = userLikedPosts.filter((id) => id !== postId)
      const updatedUser = { ...currentUser, likedPosts: updatedLikedPosts }
      setCurrentUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: post.likes - 1,
                likedBy: (post.likedBy || []).filter((id) => id !== currentUser.id),
              }
            : post,
        ),
      )
    } else {
      const updatedLikedPosts = [...userLikedPosts, postId]
      const updatedUser = { ...currentUser, likedPosts: updatedLikedPosts }
      setCurrentUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: post.likes + 1,
                likedBy: [...(post.likedBy || []), currentUser.id],
              }
            : post,
        ),
      )
    }
  }

  const handleUserClick = (userId: number) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u: DashboardUser) => u.id === userId)
    if (user) {
      setSelectedUser({
        ...user,
        bio: user.bio || "Pecinta lingkungan yang ingin berkontribusi untuk bumi yang lebih hijau 🌱",
        location: user.location || "Jakarta, Indonesia",
        joinDate: user.joinDate || "Bergabung Juni 2023",
      })
    }
  }

  const handleCommentLike = (commentId: number) => {
    if (!currentUser || !selectedPost) return

    const userLikedComments = currentUser.likedComments || []
    const hasLiked = userLikedComments.includes(commentId)

    if (hasLiked) {
      const updatedLikedComments = userLikedComments.filter((id) => id !== commentId)
      const updatedUser = { ...currentUser, likedComments: updatedLikedComments }
      setCurrentUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    } else {
      const updatedLikedComments = [...userLikedComments, commentId]
      const updatedUser = { ...currentUser, likedComments: updatedLikedComments }
      setCurrentUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }

    const updatedComments = selectedPost.commentsList?.map((comment) =>
      comment.id === commentId
        ? {
            ...comment,
            likes: hasLiked ? comment.likes - 1 : comment.likes + 1,
            likedBy: hasLiked
              ? comment.likedBy.filter((id) => id !== currentUser.id)
              : [...comment.likedBy, currentUser.id],
          }
        : comment,
    )

    const updatedPost = { ...selectedPost, commentsList: updatedComments }
    setSelectedPost(updatedPost)
    setPosts(posts.map((post) => (post.id === selectedPost.id ? updatedPost : post)))
  }

  const handleAddComment = () => {
    if (!currentUser || !selectedPost || !newComment.trim()) return

    const comment: Comment = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: newComment,
      timestamp: "Baru saja",
      likes: 0,
      likedBy: [],
    }

    const updatedComments = [...(selectedPost.commentsList || []), comment]
    const updatedPost = {
      ...selectedPost,
      commentsList: updatedComments,
      comments: updatedComments.length,
    }

    setSelectedPost(updatedPost)
    setPosts(posts.map((post) => (post.id === selectedPost.id ? updatedPost : post)))
    setNewComment("")
  }

  const handleTakeMission = (mission: Mission) => {
    setSelectedMission(mission)
  }

  const handleMissionProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setMissionProof(file)
    const url = URL.createObjectURL(file)
    setMissionProofPreview(url)
  }

  const handleSubmitMission = () => {
    if (!currentUser || !selectedMission || !missionProof) return

    const updatedUser = {
      ...currentUser,
      completedMissions: [...currentUser.completedMissions, selectedMission.id],
      points: currentUser.points + selectedMission.points,
    }

    setCurrentUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = users.map((user: any) => (user.id === currentUser.id ? updatedUser : user))
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    setMissions(
      missions.map((mission) =>
        mission.id === selectedMission.id
          ? { ...mission, completedBy: [...mission.completedBy, currentUser.id] }
          : mission,
      ),
    )

    alert(
      `Selamat! Anda telah menyelesaikan misi "${selectedMission.title}" dan mendapat ${selectedMission.points} poin!`,
    )
    setSelectedMission(null)
    setMissionProof(null)
    setMissionProofPreview("")

    // Redirect to profile after mission completion
    router.push("/profile")
  }

  const handleShare = (postId: number, platform: string) => {
    const post = posts.find((p) => p.id === postId)
    if (!post) return

    const shareText = `${post.content} - GreenSteps`
    const shareUrl = `${window.location.origin}/post/${postId}`

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      copy: shareUrl,
    }

    if (platform === "copy") {
      navigator.clipboard.writeText(shareUrls.copy)
      alert("Link berhasil disalin!")
    } else {
      window.open(shareUrls[platform as keyof typeof shareUrls], "_blank")
    }

    setShowShareModal(false)
    setSharePostId(null)
  }

  const getRankingUsers = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    return users
      .sort((a: DashboardUser, b: DashboardUser) => b.points - a.points)
      .slice(0, 15)
      .map((user: DashboardUser, index: number) => ({ ...user, rank: index + 1 }))
  }

  const filteredArticles = articles.filter((article) => {
    const provinceMatch =
      selectedProvince === "semua" || article.province.toLowerCase() === selectedProvince.toLowerCase()
    const categoryMatch =
      selectedCategory === "semua" || article.category.toLowerCase() === selectedCategory.toLowerCase()
    return provinceMatch && categoryMatch
  })

  const markNotificationAsRead = (notificationId: number) => {
    setNotifications(notifications.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)))
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  // Search Page
  if (showSearch) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Cari postingan, pengguna, atau artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="max-w-md mx-auto px-4 pb-3">
            <Tabs value={searchType} onValueChange={(value) => setSearchType(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posts">Postingan</TabsTrigger>
                <TabsTrigger value="users">Pengguna</TabsTrigger>
                <TabsTrigger value="articles">Artikel</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-4">
          {searchQuery.trim() === "" ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Mulai Pencarian</h3>
              <p className="text-gray-500">Ketik kata kunci untuk mencari postingan, pengguna, atau artikel</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak Ada Hasil</h3>
              <p className="text-gray-500">Coba gunakan kata kunci yang berbeda</p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    {searchType === "posts" && (
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={result.userAvatar || "/placeholder.svg"} />
                          <AvatarFallback>{result.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-sm">{result.userName}</span>
                            <Badge variant="secondary" className="text-xs">
                              {result.topic}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{result.content}</p>
                          <p className="text-xs text-gray-400 mt-1">{result.timestamp}</p>
                        </div>
                      </div>
                    )}
                    {searchType === "users" && (
                      <div className="flex items-center space-x-3" onClick={() => handleUserClick(result.id)}>
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={result.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{result.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">{result.name}</h3>
                          <p className="text-sm text-gray-600">{result.points} poin</p>
                        </div>
                      </div>
                    )}
                    {searchType === "articles" && (
                      <div className="flex space-x-3" onClick={() => setSelectedArticle(result)}>
                        <img
                          src={result.image || "/placeholder.svg"}
                          alt={result.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm line-clamp-2">{result.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {result.category}
                            </Badge>
                            <span className="text-xs text-gray-500">{result.readTime}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    )
  }

  // Notifications Page
  if (showNotifications) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => setShowNotifications(false)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold">Notifikasi</h1>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" className="text-xs">
              Tandai Semua Dibaca
            </Button>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Notifikasi</h3>
              <p className="text-gray-500">Notifikasi akan muncul di sini</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer transition-colors ${
                    !notification.read ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                  }`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      {notification.avatar ? (
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          {notification.type === "like" && <Heart className="h-5 w-5 text-red-500" />}
                          {notification.type === "comment" && <MessageCircle className="h-5 w-5 text-blue-500" />}
                          {notification.type === "mission" && <Trophy className="h-5 w-5 text-yellow-500" />}
                          {notification.type === "follow" && <Star className="h-5 w-5 text-green-500" />}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                      </div>
                      {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="cursor-pointer w-8 h-8" onClick={() => router.push("/profile")}>
              <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
              <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-green-800">GreenSteps</h1>
              <p className="text-xs text-gray-500">{currentUser.points} poin</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" onClick={() => setShowNotifications(true)}>
              <Bell className="h-5 w-5" />
              {notifications.filter((n) => !n.read).length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-4 pb-20">
        {activeTab === "beranda" && (
          <section className="space-y-4" aria-label="Beranda feed">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <div className="p-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8 cursor-pointer" onClick={() => handleUserClick(post.userId)}>
                      <AvatarImage src={post.userAvatar || "/placeholder.svg"} />
                      <AvatarFallback>{post.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p
                        className="font-semibold text-sm cursor-pointer hover:underline"
                        onClick={() => handleUserClick(post.userId)}
                      >
                        {post.userName}
                      </p>
                      <p className="text-xs text-gray-500">{post.timestamp}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {post.topic}
                    </Badge>
                  </div>
                </div>
                <div className="px-3 pb-2">
                  <p className="text-sm mb-3">{post.content}</p>
                </div>
                {post.image && (
                  <div className="mb-3">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt="Post content"
                      className="w-full max-h-80 object-cover"
                    />
                  </div>
                )}
                {post.video && (
                  <div className="mb-3 relative">
                    <video src={post.video} controls className="w-full max-h-80 object-contain" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-black bg-opacity-50 rounded-full p-3">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="px-3 pb-3 flex items-center space-x-6 text-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={`text-xs ${
                      currentUser.likedPosts?.includes(post.id) ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 mr-1 ${currentUser.likedPosts?.includes(post.id) ? "fill-current" : ""}`}
                    />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs" onClick={() => setSelectedPost(post)}>
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.comments}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setSharePostId(post.id)
                      setShowShareModal(true)
                    }}
                  >
                    <Share className="h-4 w-4 mr-1" />
                    Bagikan
                  </Button>
                </div>
              </Card>
            ))}
          </section>
        )}

        {activeTab === "misi" && (
          <section aria-label="Misi dan tantangan">
            <Tabs defaultValue="tantangan" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tantangan">Tantangan</TabsTrigger>
                <TabsTrigger value="rank">Peringkat</TabsTrigger>
              </TabsList>

              <TabsContent value="tantangan" className="space-y-4 mt-4">
                {missions.map((mission) => (
                  <Card key={mission.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={mission.image || "/placeholder.svg"}
                        alt={mission.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={
                            mission.difficulty === "Easy"
                              ? "default"
                              : mission.difficulty === "Medium"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs"
                        >
                          {mission.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="p-3">
                      <CardTitle className="text-base">{mission.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <p className="text-gray-600 text-sm mb-3">{mission.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {mission.category}
                          </Badge>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            <span className="font-semibold text-xs">{mission.points} poin</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleTakeMission(mission)}
                          disabled={mission.completedBy.includes(currentUser.id)}
                          className="text-xs"
                        >
                          {mission.completedBy.includes(currentUser.id) ? "Selesai" : "Ambil Misi"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="rank" className="mt-4">
                <Card>
                  <CardHeader className="p-3">
                    <CardTitle className="flex items-center text-base">
                      <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                      Top 15 Kontributor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-2">
                      {getRankingUsers().map((user: any) => (
                        <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                                user.rank === 1
                                  ? "bg-yellow-500"
                                  : user.rank === 2
                                    ? "bg-gray-400"
                                    : user.rank === 3
                                      ? "bg-orange-500"
                                      : "bg-gray-300"
                              }`}
                            >
                              {user.rank}
                            </div>
                            <Avatar className="w-6 h-6 cursor-pointer" onClick={() => handleUserClick(user.id)}>
                              <AvatarImage src={user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <span
                              className="font-semibold text-sm cursor-pointer hover:underline"
                              onClick={() => handleUserClick(user.id)}
                            >
                              {user.name}
                            </span>
                            {user.id === currentUser.id && (
                              <Badge variant="outline" className="text-xs ml-1">
                                Anda
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            <span className="font-semibold text-xs">{user.points} poin</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        )}

        {activeTab === "post" && (
          <section aria-label="Buat postingan baru">
            <Card>
              <CardHeader className="p-3">
                <CardTitle className="text-base">Buat Postingan Baru</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-3">
                <div>
                  <textarea
                    placeholder="Bagikan pengalaman atau informasi tentang lingkungan..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="w-full p-3 border rounded-lg resize-none h-24 text-sm"
                  />
                </div>

                {previewUrl && (
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full"
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewUrl("")
                        setIsVideo(false)
                        setNewPost({ ...newPost, image: "", video: "" })
                      }}
                    >
                      <X className="h-4 w-4 text-white" />
                    </Button>
                    {isVideo ? (
                      <video src={previewUrl} controls className="w-full h-48 object-contain rounded-lg" />
                    ) : (
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Topik</label>
                  <select
                    value={newPost.topic}
                    onChange={(e) => setNewPost({ ...newPost, topic: e.target.value })}
                    className="w-full p-2 border rounded-lg text-sm"
                  >
                    {postTopics.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic.charAt(0).toUpperCase() + topic.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-4 w-4 mr-1" />
                    Tambah Foto
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Video className="h-4 w-4 mr-1" />
                    Tambah Video
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                  />
                </div>

                <Button onClick={handleCreatePost} className="w-full" disabled={!newPost.content}>
                  Posting
                </Button>
              </CardContent>
            </Card>
          </section>
        )}

        {activeTab === "ar" && (
          <section className="space-y-4" aria-label="Fitur AR">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Augmented Reality</h2>
              <p className="text-gray-600 text-sm">Jelajahi dunia lingkungan dengan teknologi AR</p>
            </div>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=600&h=300&fit=crop"
                  alt="Simulasi Pemungutan Sampah"
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="bg-blue-500 p-2 rounded-full">
                      <Recycle className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-blue-500/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white text-xs font-medium">AR Experience</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Simulasi Pemungutan Sampah</h3>
                  <p className="text-sm text-gray-200">
                    Pelajari cara memilah dan mengumpulkan sampah dengan benar menggunakan AR
                  </p>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">15 menit</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Interaktif
                  </Badge>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  onClick={() => window.open("https://your-simulation-link.com", "_blank")}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Mulai Simulasi AR
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&h=300&fit=crop"
                  alt="Scanning dan Pengenalan Sampah"
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="bg-green-500 p-2 rounded-full">
                      <Camera className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white text-xs font-medium">AI Powered</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Scanning Sampah AI</h3>
                  <p className="text-sm text-gray-200">Identifikasi jenis sampah menggunakan teknologi AI dan AR</p>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">4.9</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">Real-time</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    AI Scanner
                  </Badge>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  onClick={() => window.open("https://your-scanning-link.com", "_blank")}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Mulai Scanning AR
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=300&fit=crop"
                  alt="Virtual Forest Tour"
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="bg-emerald-500 p-2 rounded-full">
                      <TreePine className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-emerald-500/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white text-xs font-medium">Virtual Tour</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Tur Virtual Hutan</h3>
                  <p className="text-sm text-gray-200">Jelajahi hutan Indonesia secara virtual dengan AR</p>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">4.7</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">30 menit</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    360° View
                  </Badge>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                  onClick={() => window.open("https://your-forest-tour-link.com", "_blank")}
                >
                  <TreePine className="h-4 w-4 mr-2" />
                  Mulai Tur Virtual
                </Button>
              </CardContent>
            </Card>
          </section>
        )}

        {activeTab === "perpustakaan" && (
          <section className="space-y-4" aria-label="Perpustakaan artikel">
            <Card>
              <CardHeader className="p-3">
                <CardTitle className="text-base flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Artikel
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Provinsi</label>
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full p-2 border rounded-lg text-sm"
                  >
                    {provinces.map((province) => (
                      <option key={province} value={province.toLowerCase()}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Kategori</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border rounded-lg text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category.toLowerCase()}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="flex">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-24 h-24 object-cover"
                    />
                    <CardContent className="flex-1 p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {article.category}
                        </Badge>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {article.province}
                        </div>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{article.readTime}</span>
                      </div>
                      <h3 className="text-sm font-bold mb-1 line-clamp-2">{article.title}</h3>
                      <p className="text-gray-600 text-xs line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">Oleh {article.author}</span>
                        <span className="text-xs text-gray-400">{article.date}</span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* User Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-lg max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold">Profil Pengguna</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedUser(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <div className="text-center mb-4">
                <Avatar className="w-20 h-20 mx-auto mb-3">
                  <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xl">{selectedUser.name[0]}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                <p className="text-gray-600 text-sm mb-2">{selectedUser.bio}</p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {selectedUser.location}
                  </div>
                  <span>•</span>
                  <span>{selectedUser.joinDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{selectedUser.points}</div>
                  <div className="text-xs text-gray-600">Poin</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{selectedUser.posts?.length || 0}</div>
                  <div className="text-xs text-gray-600">Postingan</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">{selectedUser.completedMissions?.length || 0}</div>
                  <div className="text-xs text-gray-600">Misi</div>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                Ikuti Pengguna
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-lg max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold">Komentar</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedPost(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {selectedPost.commentsList?.map((comment) => (
                <div key={comment.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.userAvatar || "/placeholder.svg"} />
                      <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-sm">{comment.userName}</span>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm mb-2">{comment.content}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCommentLike(comment.id)}
                        className={`text-xs ${
                          currentUser.likedComments?.includes(comment.id) ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        <Heart
                          className={`h-3 w-3 mr-1 ${
                            currentUser.likedComments?.includes(comment.id) ? "fill-current" : ""
                          }`}
                        />
                        {comment.likes}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder="Tulis komentar..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mission Detail Modal */}
      {selectedMission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg max-h-[80vh] overflow-hidden">
            <div className="relative">
              <img
                src={selectedMission.image || "/placeholder.svg"}
                alt={selectedMission.title}
                className="w-full h-32 object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full"
                onClick={() => setSelectedMission(null)}
              >
                <X className="h-4 w-4 text-white" />
              </Button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">{selectedMission.title}</h3>
                <Badge
                  variant={
                    selectedMission.difficulty === "Easy"
                      ? "default"
                      : selectedMission.difficulty === "Medium"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {selectedMission.difficulty}
                </Badge>
              </div>

              <p className="text-gray-600 mb-4">{selectedMission.description}</p>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Langkah-langkah:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  {selectedMission.steps?.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  Persyaratan:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {selectedMission.requirements?.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                    Deadline: {selectedMission.deadline}
                  </span>
                  <span className="flex items-center font-semibold text-green-600">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    {selectedMission.points} poin
                  </span>
                </div>
              </div>

              {selectedMission.proofRequired && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Bukti Penyelesaian:
                  </h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {missionProofPreview ? (
                      <div className="relative">
                        <img
                          src={missionProofPreview || "/placeholder.svg"}
                          alt="Bukti misi"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full"
                          onClick={() => {
                            setMissionProof(null)
                            setMissionProofPreview("")
                          }}
                        >
                          <X className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm mb-2">Klik untuk upload foto atau video bukti</p>
                        <input
                          type="file"
                          ref={missionProofRef}
                          className="hidden"
                          accept="image/*,video/*"
                          onChange={handleMissionProofChange}
                        />
                        <Button variant="outline" onClick={() => missionProofRef.current?.click()}>
                          Pilih File
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t">
              <Button
                onClick={handleSubmitMission}
                className="w-full"
                disabled={selectedMission.proofRequired && !missionProof}
              >
                Selesaikan Misi
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && sharePostId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-lg">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold">Bagikan Postingan</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowShareModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => handleShare(sharePostId, "whatsapp")}
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white text-xs font-bold">WA</span>
                  </div>
                  <span className="text-xs">WhatsApp</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => handleShare(sharePostId, "telegram")}
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white text-xs font-bold">TG</span>
                  </div>
                  <span className="text-xs">Telegram</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => handleShare(sharePostId, "facebook")}
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white text-xs font-bold">FB</span>
                  </div>
                  <span className="text-xs">Facebook</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => handleShare(sharePostId, "twitter")}
                >
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mb-2">
                    <span className="text-white text-xs font-bold">X</span>
                  </div>
                  <span className="text-xs">Twitter</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => handleShare(sharePostId, "linkedin")}
                >
                  <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white text-xs font-bold">LI</span>
                  </div>
                  <span className="text-xs">LinkedIn</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => handleShare(sharePostId, "copy")}
                >
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center mb-2">
                    <ExternalLink className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs">Salin Link</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="max-w-md mx-auto">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white">
              <Button variant="ghost" size="icon" onClick={() => setSelectedArticle(null)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-bold text-center flex-1">Artikel</h3>
              <Button variant="ghost" size="icon">
                <Share className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <img
                src={selectedArticle.image || "/placeholder.svg"}
                alt={selectedArticle.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center space-x-2 mb-3">
                <Badge variant="outline" className="text-xs">
                  {selectedArticle.category}
                </Badge>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="h-3 w-3 mr-1" />
                  {selectedArticle.province}
                </div>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{selectedArticle.readTime}</span>
              </div>
              <h1 className="text-xl font-bold mb-3">{selectedArticle.title}</h1>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>Oleh {selectedArticle.author}</span>
                <span className="mx-2">•</span>
                <span>{selectedArticle.date}</span>
              </div>
              <div
                className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content || selectedArticle.excerpt }}
              />

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Bagikan Artikel Ini</h4>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Share className="h-4 w-4 mr-1" />
                    Bagikan
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Heart className="h-4 w-4 mr-1" />
                    Suka
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-md mx-auto px-2">
          <div className="flex justify-around py-2">
            <Button
              variant={activeTab === "beranda" ? "default" : "ghost"}
              className="flex flex-col items-center py-1 px-2 h-auto"
              onClick={() => setActiveTab("beranda")}
            >
              <Home className="h-5 w-5 mb-1" />
              <span className="text-xs">Beranda</span>
            </Button>

            <Button
              variant={activeTab === "misi" ? "default" : "ghost"}
              className="flex flex-col items-center py-1 px-2 h-auto"
              onClick={() => setActiveTab("misi")}
            >
              <Target className="h-5 w-5 mb-1" />
              <span className="text-xs">Misi</span>
            </Button>

            <Button
              variant={activeTab === "post" ? "default" : "ghost"}
              className="flex flex-col items-center py-1 px-2 h-auto"
              onClick={() => setActiveTab("post")}
            >
              <Plus className="h-5 w-5 mb-1" />
              <span className="text-xs">Post</span>
            </Button>

            <Button
              variant={activeTab === "ar" ? "default" : "ghost"}
              className="flex flex-col items-center py-1 px-2 h-auto"
              onClick={() => setActiveTab("ar")}
            >
              <Camera className="h-5 w-5 mb-1" />
              <span className="text-xs">AR</span>
            </Button>

            <Button
              variant={activeTab === "perpustakaan" ? "default" : "ghost"}
              className="flex flex-col items-center py-1 px-2 h-auto"
              onClick={() => setActiveTab("perpustakaan")}
            >
              <BookOpen className="h-5 w-5 mb-1" />
              <span className="text-xs">Perpus</span>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  )
}
