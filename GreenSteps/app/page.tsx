"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Leaf, Mail, Lock, User } from "lucide-react"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Initialize sample users if they don't exist
    if (!localStorage.getItem("users")) {
      const sampleUsers = [
        {
          id: 1,
          name: "Andi Pratama",
          email: "andi@example.com",
          password: "password123",
          avatar: "/placeholder.svg?height=40&width=40",
          points: 950,
          posts: [],
          completedMissions: [1, 2, 3],
        },
        {
          id: 2,
          name: "Sari Dewi",
          email: "sari@example.com",
          password: "password123",
          avatar: "/placeholder.svg?height=40&width=40",
          points: 870,
          posts: [],
          completedMissions: [1, 2],
        },
        {
          id: 3,
          name: "Budi Santoso",
          email: "budi@example.com",
          password: "password123",
          avatar: "/placeholder.svg?height=40&width=40",
          points: 820,
          posts: [],
          completedMissions: [1, 3],
        },
        {
          id: 4,
          name: "Dian Purnama",
          email: "dian@example.com",
          password: "password123",
          avatar: "/placeholder.svg?height=40&width=40",
          points: 780,
          posts: [],
          completedMissions: [2],
        },
        {
          id: 5,
          name: "Eko Prasetyo",
          email: "eko@example.com",
          password: "password123",
          avatar: "/placeholder.svg?height=40&width=40",
          points: 750,
          posts: [],
          completedMissions: [1],
        },
        {
          id: 6,
          name: "Fitri Handayani",
          email: "fitri@example.com",
          password: "password123",
          avatar: "/placeholder.svg?height=40&width=40",
          points: 720,
          posts: [],
          completedMissions: [3],
        },
        {
          id: 7,
          name: "Gunawan Wibowo",
          email: "gunawan@example.com",
          password: "password123",
          avatar: "/placeholder.svg?height=40&width=40",
          points: 690,
          posts: [],
          completedMissions: [1, 2],
        },
        {
          id: 8,
          name: "Hani Susanti",
          email: "hani@example.com",
          password: "password123",
          avatar: "/placeholder.svg?height=40&width=40",
          points: 650,
          posts: [],
          completedMissions: [2],
        },
        {
          id: 9,
          name: "Irfan Hakim",
          email: "irfan@example.com",
          password: "password123",
          avatar: "/placeholder.svg?height=40&width=40",
          points: 620,
          posts: [],
          completedMissions: [1],
        },
        {
          id: 10,
          name: "Joko Widodo",
          email: "joko@example.com",
          password: "password123",
          avatar: "/placeholder.svg?height=40&width=40",
          points: 590,
          posts: [],
          completedMissions: [3],
        },
        {
          id: 11,
          name: "Kartika Sari",
          email: "kartika@example.com",
          password: "password123",
          avatar: "/placeholder.svg?height=40&width=40",
          points: 560,
          posts: [],
          completedMissions: [1],
        },
        {
          id: 12,
          name: "Lukman Hakim",
          email: "lukman@example.com",
          password: "password123",
          avatar: "/placeholder.svg?height=40&width=40",
          points: 530,
          posts: [],
          completedMissions: [2],
        },
        {
          id: 13,
          name: "Maya Anggraini",
          email: "maya@example.com",
          password: "password123",
          avatar: "/placeholder.svg?height=40&width=40",
          points: 500,
          posts: [],
          completedMissions: [3],
        },
      ]
      localStorage.setItem("users", JSON.stringify(sampleUsers))
    }

    // Check if user is already logged in
    const user = localStorage.getItem("currentUser")
    if (user) {
      router.push("/dashboard")
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isLogin) {
      // Login logic
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const user = users.find((u: any) => u.email === email && u.password === password)

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user))
        router.push("/dashboard")
      } else {
        alert("Email atau password salah!")
      }
    } else {
      // Register logic
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const existingUser = users.find((u: any) => u.email === email)

      if (existingUser) {
        alert("Email sudah terdaftar!")
        return
      }

      const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        avatar: "/placeholder.svg?height=40&width=40",
        points: 480, // Points for new user (position 14)
        posts: [],
        completedMissions: [],
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))
      localStorage.setItem("currentUser", JSON.stringify(newUser))
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">GreenSteps</CardTitle>
          <CardDescription>Platform Peduli Lingkungan Indonesia</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={isLogin ? "login" : "register"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" onClick={() => setIsLogin(true)}>
                Masuk
              </TabsTrigger>
              <TabsTrigger value="register" onClick={() => setIsLogin(false)}>
                Daftar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Masukkan email Anda"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Masukkan password Anda"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Masuk
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Masukkan nama lengkap Anda"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Masukkan email Anda"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Masukkan password Anda"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Daftar
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
