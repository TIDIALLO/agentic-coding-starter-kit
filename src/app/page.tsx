"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { useDiagnostics } from "@/hooks/use-diagnostics";
import { Building2, Users, Calendar, FileText, ImageIcon, BarChart3, Video, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function Home()
{
  const { t } = useI18n();
  const { isAuthReady, loading } = useDiagnostics();
  const container = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, ease: "easeOut", duration: 0.45 },
    },
  } as const;
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.5 } },
  } as const;
  const videoSrc = process.env.NEXT_PUBLIC_HERO_VIDEO_URL || "/hero-demo.webm";
  const [videoOk, setVideoOk] = useState(true);
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12">
        <motion.div className="max-w-6xl mx-auto text-center space-y-8" initial="hidden" animate="show" variants={container}>
          <motion.div variants={item}>
            <BackgroundGradient className="rounded-3xl p-10 border shadow-xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                  <Building2 className="h-7 w-7 text-primary" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                  ImmoBoost
                </h1>
              </div>
              <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">{t.home.subtitle}</h2>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">{t.home.heroDescription}</p>

              <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
                <Button asChild className="h-11 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Link href="/room-redesign" className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Générer des images</Link>
                </Button>
                <Button asChild variant="outline" className="h-11 px-6">
                  <Link href="/social-studio" className="flex items-center gap-2"><Share2 className="h-4 w-4" /> Publier sur les réseaux</Link>
                </Button>
                <Button asChild variant="outline" className="h-11 px-6">
                  <Link href="/room-redesign" className="flex items-center gap-2"><Video className="h-4 w-4" /> Créer une vidéo</Link>
                </Button>
              </div>
            </BackgroundGradient>
          </motion.div>

          {/* Demo area: living room image (left) + generated video (right) */}
          <motion.div variants={item} className="mt-4">
            <div className="mx-auto max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Living room image with armchairs */}
                <div className="rounded-2xl overflow-hidden border bg-white/70 dark:bg-slate-900/60 backdrop-blur">
                  <div className="relative aspect-video">
                    <img
                      src="https://images.unsplash.com/photo-1505691723518-36a5ac3b2b95?auto=format&fit=crop&w=1600&q=80"
                      alt="Salon moderne avec fauteuils"
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Right: Generated video preview */}
                <div className="rounded-2xl overflow-hidden border bg-white/70 dark:bg-slate-900/60 backdrop-blur relative">
                  <div className="relative aspect-video">
                    {videoOk ? (
                      <video
                        key={videoSrc}
                        src={videoSrc}
                        poster="/window.svg"
                        autoPlay
                        muted
                        loop
                        playsInline
                        onError={() => setVideoOk(false)}
                        className="absolute inset-0 w-full h-full object-cover"
                      >
                        <source src={videoSrc} type="video/webm" />
                      </video>
                    ) : (
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center text-slate-600 dark:text-slate-300">
                        <div className="text-center space-y-3">
                          <div className="text-sm">Démo vidéo indisponible</div>
                          <div className="flex items-center justify-center gap-2">
                            <Button asChild size="sm" variant="outline"><Link href="/room-redesign">Générer des images</Link></Button>
                            <Button asChild size="sm" variant="outline"><Link href="/social-studio">Publier</Link></Button>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12" variants={container}>
            {/* 1) Amélioration d'images par IA */}
            <motion.div variants={item} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 180, damping: 16 }}>
              <Card className="h-full rounded-3xl border-white/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur group shadow-lg transition-all duration-300">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <ImageIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{t.home.cards.aiTitle}</h3>
                      <p className="text-muted-foreground leading-relaxed">{t.home.cards.aiDesc}</p>
                    </div>
                    <div className="pt-2 mt-auto">
                      <Button asChild variant="outline" size="sm" className="group-hover:bg-pink-50 group-hover:border-pink-300 transition-all duration-300">
                        <Link href="/image-enhancement">{t.home.cards.aiCta}</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 2) Publier sur les réseaux */}
            <motion.div variants={item} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 180, damping: 16 }}>
              <Card className="h-full rounded-3xl border-white/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur group shadow-lg transition-all duration-300">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <Share2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Publier sur les réseaux</h3>
                      <p className="text-muted-foreground leading-relaxed">Sélection des plateformes, légendes IA, publication ou planification.</p>
                    </div>
                    <div className="pt-2 mt-auto">
                      <Button asChild variant="outline" size="sm" className="group-hover:bg-cyan-50 group-hover:border-cyan-300 transition-all duration-300">
                        <Link href="/social-studio">Publier</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 3) Générer des images */}
            <motion.div variants={item} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 180, damping: 16 }}>
              <Card className="h-full rounded-3xl border-white/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur group shadow-lg transition-all duration-300">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <ImageIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Générer des images</h3>
                      <p className="text-muted-foreground leading-relaxed">Redesign de pièces, prompts personnalisés, variations multi‑seeds.</p>
                    </div>
                    <div className="pt-2 mt-auto">
                      <Button asChild variant="outline" size="sm" className="group-hover:bg-pink-50 group-hover:border-pink-300 transition-all duration-300">
                        <Link href="/room-redesign">Essayer</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 4) Créer des vidéos */}
            <motion.div variants={item} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 180, damping: 16 }}>
              <Card className="h-full rounded-3xl border-white/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur group shadow-lg transition-all duration-300">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Créer des vidéos</h3>
                      <p className="text-muted-foreground leading-relaxed">Diaporamas animés, transitions fluides, export webm.</p>
                    </div>
                    <div className="pt-2 mt-auto">
                      <Button asChild variant="outline" size="sm" className="group-hover:bg-violet-50 group-hover:border-violet-300 transition-all duration-300">
                        <Link href="/room-redesign">Générer</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Le reste: gestion, visites, prospects, contrats, analytics */}
            <motion.div variants={item} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 180, damping: 16 }}>
              <Card className="h-full rounded-3xl border-white/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur group shadow-lg transition-all duration-300">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{t.home.cards.propertiesTitle}</h3>
                      <p className="text-muted-foreground leading-relaxed">{t.home.cards.propertiesDesc}</p>
                    </div>
                    <div className="pt-2 mt-auto">
                      <Button asChild variant="outline" size="sm" className="group-hover:bg-blue-50 group-hover:border-blue-300 transition-all duration-300">
                        <Link href="/properties">{t.home.cards.propertiesCta}</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 180, damping: 16 }}>
              <Card className="h-full rounded-3xl border-white/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur group shadow-lg transition-all duration-300">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{t.home.cards.visitsTitle}</h3>
                      <p className="text-muted-foreground leading-relaxed">{t.home.cards.visitsDesc}</p>
                    </div>
                    <div className="pt-2 mt-auto">
                      <Button asChild variant="outline" size="sm" className="group-hover:bg-emerald-50 group-hover:border-emerald-300 transition-all duration-300">
                        <Link href="/visits">{t.home.cards.visitsCta}</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 180, damping: 16 }}>
              <Card className="h-full rounded-3xl border-white/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur group shadow-lg transition-all duration-300">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{t.home.cards.prospectsTitle}</h3>
                      <p className="text-muted-foreground leading-relaxed">{t.home.cards.prospectsDesc}</p>
                    </div>
                    <div className="pt-2 mt-auto">
                      <Button asChild variant="outline" size="sm" className="group-hover:bg-purple-50 group-hover:border-purple-300 transition-all duration-300">
                        <Link href="/prospects">{t.home.cards.prospectsCta}</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 180, damping: 16 }}>
              <Card className="h-full rounded-3xl border-white/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur group shadow-lg transition-all duration-300">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{t.home.cards.contractsTitle}</h3>
                      <p className="text-muted-foreground leading-relaxed">{t.home.cards.contractsDesc}</p>
                    </div>
                    <div className="pt-2 mt-auto">
                      <Button asChild variant="outline" size="sm" className="group-hover:bg-orange-50 group-hover:border-orange-300 transition-all duration-300">
                        <Link href="/contracts">{t.home.cards.contractsCta}</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 180, damping: 16 }}>
              <Card className="h-full rounded-3xl border-white/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur group shadow-lg transition-all duration-300">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{t.home.cards.analyticsTitle}</h3>
                      <p className="text-muted-foreground leading-relaxed">{t.home.cards.analyticsDesc}</p>
                    </div>
                    <div className="pt-2 mt-auto">
                      <Button asChild variant="outline" size="sm" className="group-hover:bg-cyan-50 group-hover:border-cyan-300 transition-all duration-300">
                        <Link href="/dashboard">{t.home.cards.analyticsCta}</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div className="space-y-8 mt-20" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <div className="text-center">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
              {t.home.getStartedTitle}
            </h3>
            <p className="text-muted-foreground text-lg">
              {t.home.getStartedSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <motion.div variants={item} whileHover={{ y: -6 }}>
              <Card className="rounded-3xl border-white/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur group shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-foreground">{t.home.agentsCard.title}</h4>
                        <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full w-fit mt-1">
                          {t.home.agentsCard.badge}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {t.home.agentsCard.description}
                    </p>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t.home.agentsCard.features.join("<br />") }} />
                      {loading || !isAuthReady ? (
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12" disabled={true}>
                          {t.home.agentsCard.disabledCta}
                        </Button>
                      ) : (
                        <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12">
                          <Link href="/dashboard">{t.home.agentsCard.cta}</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} whileHover={{ y: -6 }}>
              <Card className="rounded-3xl border-white/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur group shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-foreground">{t.home.seekersCard.title}</h4>
                        <div className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full w-fit mt-1">
                          {t.home.seekersCard.badge}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {t.home.seekersCard.description}
                    </p>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t.home.seekersCard.features.join("<br />") }} />
                      <Button asChild variant="outline" className="w-full border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 h-12">
                        <Link href="/properties">{t.home.seekersCard.cta}</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} whileHover={{ y: -6 }}>
              <Card className="rounded-3xl border-white/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur group shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-foreground">{t.home.scheduleCard.title}</h4>
                        <div className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full w-fit mt-1">
                          {t.home.scheduleCard.badge}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {t.home.scheduleCard.description}
                    </p>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t.home.scheduleCard.features.join("<br />") }} />
                      <Button asChild variant="outline" className="w-full border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 h-12">
                        <Link href="/visits">{t.home.scheduleCard.cta}</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
