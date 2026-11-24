"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Settings, Star, Trophy, Heart, MessageCircle, Share, Award, Camera } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  avatar: string
  points: number
  posts: any[]
  completedMissions: number[]
}

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [userStats, setUserStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    completedMissions: 0,
    rank: 0,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<User | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/")
      return
    }

    const userData = JSON.parse(user)
    setCurrentUser(userData)
    setEditedUser(userData)

    // Sample user posts
    const sampleUserPosts = [
      {
        id: 1,
        content: "Hari ini berhasil menanam 3 pohon di taman kota! 🌱",
        image: "data:image/jpeg;base64,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",
        topic: "penghijauan",
        likes: 15,
        comments: 3,
        timestamp: "1 hari yang lalu",
      },
      {
        id: 2,
        content: "Membersihkan sampah di pantai bersama komunitas lokal. Mari jaga kebersihan laut kita! 🌊",
        image: "/placeholder.svg?height=300&width=400",
        topic: "kebersihan",
        likes: 28,
        comments: 7,
        timestamp: "3 hari yang lalu",
      },
      {
        id: 3,
        content: "Workshop daur ulang sampah plastik menjadi pot tanaman. Kreativitas untuk lingkungan! ♻️",
        image: "/placeholder.svg?height=300&width=400",
        topic: "daur ulang",
        likes: 22,
        comments: 5,
        timestamp: "1 minggu yang lalu",
      },
    ]

    setUserPosts(sampleUserPosts)

    // Calculate user stats
    const totalLikes = sampleUserPosts.reduce((sum, post) => sum + post.likes, 0)

    // Get user rank
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const sortedUsers = [...users].sort((a, b) => b.points - a.points)
    const userRank = sortedUsers.findIndex((u) => u.id === userData.id) + 1

    setUserStats({
      totalPosts: sampleUserPosts.length,
      totalLikes: totalLikes,
      completedMissions: userData.completedMissions?.length || 5,
      rank: userRank,
    })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarPreview(reader.result)
        if (editedUser) {
          setEditedUser({ ...editedUser, avatar: reader.result })
        }
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = () => {
    if (!editedUser || !currentUser) return

    // Update user in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = users.map((user: User) => (user.id === currentUser.id ? editedUser : user))
    localStorage.setItem("users", JSON.stringify(updatedUsers))
    localStorage.setItem("currentUser", JSON.stringify(editedUser))

    // Update current user state
    setCurrentUser(editedUser)
    setIsEditing(false)
  }

  if (!currentUser || !editedUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-bold text-base">Profil</h1>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Profile Header */}
      <section className="bg-gradient-to-br from-green-500 to-blue-500 text-white" aria-label="Profil pengguna">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar className="w-20 h-20 mb-3 border-4 border-white">
                <AvatarImage src={avatarPreview || currentUser.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xl">{currentUser.name[0]}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full w-6 h-6"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-3 w-3" />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </Button>
              )}
            </div>
            {isEditing ? (
              <div className="w-full max-w-xs">
                <Input
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  className="mb-2 bg-white/20 border-white/30 text-white placeholder:text-white/70 text-center"
                  placeholder="Nama Anda"
                />
                <Input
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  className="mb-3 bg-white/20 border-white/30 text-white placeholder:text-white/70 text-center"
                  placeholder="Email Anda"
                />
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false)
                      setAvatarPreview(null)
                      setEditedUser(currentUser)
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    variant="default"
                    className="flex-1 bg-white text-green-600 hover:bg-white/90"
                    size="sm"
                    onClick={handleSaveProfile}
                  >
                    Simpan
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-1">{currentUser.name}</h2>
                <p className="text-green-100 mb-3 text-sm">{currentUser.email}</p>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="h-4 w-4 mr-1" />
                      <span className="text-lg font-bold">{currentUser.points}</span>
                    </div>
                    <p className="text-xs text-green-100">Poin</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Trophy className="h-4 w-4 mr-1" />
                      <span className="text-lg font-bold">#{userStats.rank}</span>
                    </div>
                    <p className="text-xs text-green-100">Peringkat</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Award className="h-4 w-4 mr-1" />
                      <span className="text-lg font-bold">{userStats.completedMissions}</span>
                    </div>
                    <p className="text-xs text-green-100">Misi</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="max-w-md mx-auto px-4 -mt-4 mb-4" aria-label="Statistik pengguna">
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-blue-600">{userStats.totalPosts}</div>
              <div className="text-xs text-gray-600">Postingan</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-red-600">{userStats.totalLikes}</div>
              <div className="text-xs text-gray-600">Total Suka</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-green-600">{userStats.completedMissions}</div>
              <div className="text-xs text-gray-600">Misi Selesai</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="max-w-md mx-auto px-4 pb-20" aria-label="Konten pengguna">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Postingan</TabsTrigger>
            <TabsTrigger value="achievements">Pencapaian</TabsTrigger>
            <TabsTrigger value="settings">Pengaturan</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-3 mt-4">
            {userPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <div className="p-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{currentUser.name}</p>
                      <p className="text-xs text-gray-500">{post.timestamp}</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {post.topic}
                    </Badge>
                  </div>
                </div>
                <div className="px-3 pb-2">
                  <p className="text-sm">{post.content}</p>
                </div>
                {post.image && (
                  <div className="mb-3">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt="Post content"
                      className="w-full max-h-60 object-cover"
                    />
                  </div>
                )}
                <div className="px-3 pb-3 flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1 text-red-500" />
                    <span className="text-xs">{post.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1 text-blue-500" />
                    <span className="text-xs">{post.comments}</span>
                  </div>
                  <div className="flex items-center">
                    <Share className="h-4 w-4 mr-1 text-green-500" />
                    <span className="text-xs">Bagikan</span>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-3 mt-4">
            <Card>
              <CardContent className="p-3">
                <h3 className="font-bold mb-3 text-sm">Lencana dan Pencapaian</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                    <div className="bg-yellow-500 p-1 rounded-full">
                      <Trophy className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs">Eco Warrior</p>
                      <p className="text-xs text-gray-600">Selesaikan 5 misi</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                    <div className="bg-green-500 p-1 rounded-full">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs">Green Influencer</p>
                      <p className="text-xs text-gray-600">Dapatkan 50+ suka</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                    <div className="bg-blue-500 p-1 rounded-full">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs">Content Creator</p>
                      <p className="text-xs text-gray-600">Buat 3+ postingan</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
                    <div className="bg-purple-500 p-1 rounded-full">
                      <Heart className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs">Community Helper</p>
                      <p className="text-xs text-gray-600">Bantu komunitas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-3 mt-4">
            <Card>
              <CardContent className="p-3 space-y-3">
                <Button variant="outline" className="w-full justify-start text-sm" onClick={() => setIsEditing(true)}>
                  Edit Profil
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  Notifikasi
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  Privasi
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  Bantuan
                </Button>
                <Button variant="destructive" className="w-full text-sm" onClick={handleLogout}>
                  Keluar
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
