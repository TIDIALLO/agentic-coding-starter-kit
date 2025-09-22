"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDropzone } from "react-dropzone";
import
{
  Camera,
  Upload,
  Download,
  Sparkles,
  Image as ImageIcon,
  Zap,
  Palette,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileImage,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BackgroundGradientDemo } from "@/components/ui/background-gradient-demo";

interface ImageMetadata
{
  name: string;
  size: number;
  type: string;
  dimensions: { width: number; height: number };
  lastModified: number;
}

interface EnhancementOptions
{
  professional: { name: "🎯 Professional", description: "Perfect for real estate marketing" };
  brightness: { name: "☀️ Brightness", description: "Improve lighting and visibility" };
  contrast: { name: "⚡ Contrast", description: "Enhance clarity and definition" };
  color: { name: "🎨 Color Enhancement", description: "Vibrant and appealing colors" };
}

export default function ImageEnhancementPage()
{
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedEnhancement, setSelectedEnhancement] = useState<keyof EnhancementOptions>("professional");
  const [processingStep, setProcessingStep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [canRetry, setCanRetry] = useState(false);
  const [autoRetryCountdown, setAutoRetryCountdown] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [roomType, setRoomType] = useState<
    'living_room' | 'bedroom' | 'kitchen' | 'bathroom' | 'dining_room' | 'office' | 'outdoor' | 'other'
  >('living_room');
  const [designTheme, setDesignTheme] = useState<
    'modern' | 'minimalist' | 'industrial' | 'scandinavian' | 'traditional' | 'bohemian' | 'rustic' | 'coastal' | 'vintage' | 'luxury'
  >('modern');
  const [variantSeed, setVariantSeed] = useState<number>(Math.floor(Math.random() * 1e6));
  const [intensity, setIntensity] = useState<'subtle' | 'balanced' | 'bold'>('balanced');
  const [speedProfile, setSpeedProfile] = useState<'fast' | 'balanced' | 'hq'>('balanced');

  const enhancementOptions: EnhancementOptions = {
    professional: { name: "🎯 Professional", description: "Perfect for real estate marketing" },
    brightness: { name: "☀️ Brightness", description: "Improve lighting and visibility" },
    contrast: { name: "⚡ Contrast", description: "Enhance clarity and definition" },
    color: { name: "🎨 Color Enhancement", description: "Vibrant and appealing colors" },
  };

  const onDrop = useCallback((acceptedFiles: File[]) =>
  {
    const file = acceptedFiles[0];
    if (file) {
      setError(null);
      setErrorType(null);
      setRetryAfter(null);
      setCanRetry(false);
      const reader = new FileReader();
      reader.onload = (e) =>
      {
        const result = e.target?.result as string;
        setOriginalImage(result);
        setEnhancedImage(null);

        // Create an image element to get dimensions
        const img = document.createElement('img');
        img.onload = () =>
        {
          setImageMetadata({
            name: file.name,
            size: file.size,
            type: file.type,
            dimensions: { width: img.width, height: img.height },
            lastModified: file.lastModified,
          });
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
  });

  // Downscale DataURL to reduce request size and avoid hitting strict quotas
  const downscaleDataUrl = (dataUrl: string, maxDim = 1080, quality = 0.85): Promise<string> =>
  {
    return new Promise((resolve) =>
    {
      const img = new Image();
      img.onload = () =>
      {
        const ratio = Math.min(1, maxDim / Math.max(img.width, img.height));
        if (ratio === 1) return resolve(dataUrl);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(dataUrl);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // Simple local fallback enhancement using Canvas filters
  const applyLocalEnhancement = (dataUrl: string): Promise<string> =>
  {
    return new Promise((resolve) =>
    {
      const img = new Image();
      img.onload = () =>
      {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(dataUrl);

        const baseFilters: Record<string, string> = {
          professional: 'brightness(1.06) contrast(1.08) saturate(1.07)',
          brightness: 'brightness(1.15)',
          contrast: 'contrast(1.15)',
          color: 'saturate(1.2)',
        };

        const themeFilters: Record<string, string> = {
          modern: 'contrast(1.1) saturate(1.05)',
          minimalist: 'contrast(1.05) saturate(0.9)',
          industrial: 'contrast(1.15) brightness(0.98)',
          scandinavian: 'brightness(1.05) saturate(0.95)',
          traditional: 'brightness(1.04) saturate(1.02)',
          bohemian: 'saturate(1.2)',
          rustic: 'sepia(0.15) saturate(1.05)',
          coastal: 'saturate(1.1) hue-rotate(5deg)',
          vintage: 'sepia(0.35) contrast(1.05)',
          luxury: 'contrast(1.2) brightness(1.05)',
        };

        const base = baseFilters[selectedEnhancement] || baseFilters.professional;
        const theme = themeFilters[designTheme] || '';
        ctx.filter = `${base} ${theme}`.trim();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const enhanceImage = async () =>
  {
    if (!originalImage || !imageMetadata) return;

    setIsProcessing(true);
    setError(null);
    setErrorType(null);
    setRetryAfter(null);
    setCanRetry(false);
    setProcessingStep("🔄 Preparing image...");

    try {
      // Extract base64 data from data URL after optional downscale (based on speed profile)
      const profile = speedProfile;
      const maxDim = profile === 'fast' ? 900 : profile === 'hq' ? 1400 : 1080;
      const jpegQ = profile === 'fast' ? 0.8 : profile === 'hq' ? 0.9 : 0.85;
      const preprocessed = await downscaleDataUrl(originalImage, maxDim, jpegQ);
      const base64Data = preprocessed.split(',')[1];

      setProcessingStep("🤖 Processing with Google Nano Banana AI...");

      const maxAttempts = 3;
      let defaultDelay = 30; // seconds
      let currentAttempt = 0;

      while (true) {
        currentAttempt += 1;
        setAttempt(currentAttempt);

        const controller = new AbortController();
        const timeoutMs = profile === 'fast' ? 25000 : profile === 'hq' ? 60000 : 45000;
        const timeout = setTimeout(() => controller.abort(), timeoutMs);
        const response = await fetch('/api/enhance-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body: JSON.stringify({
            imageData: base64Data,
            mimeType: imageMetadata.type,
            enhancementType: selectedEnhancement,
            roomType,
            designTheme,
            variantSeed,
            intensity,
          }),
        });
        clearTimeout(timeout);

        const result = await response.json();

        if (response.ok) {
          setProcessingStep("✨ Finalizing enhancement...");
          const enhancedDataUrl = `data:${result.mimeType};base64,${result.enhancedImageData}`;
          setEnhancedImage(enhancedDataUrl);
          setProcessingStep("🎉 Enhancement complete!");
          break;
        }

        const type: string | undefined = result.errorType;
        const delay = result.retryAfter ?? defaultDelay;
        setErrorType(type || null);
        setRetryAfter(delay);
        setCanRetry(true);

        // If backend signals zero free-tier quota, skip auto retries and go straight to local fallback
        if (result.quotaZero === true && type === 'quota_exceeded') {
          setProcessingStep('⚠️ Free-tier quota is 0. Using local fallback...');
          const fallbackUrl = await applyLocalEnhancement(preprocessed);
          setEnhancedImage(fallbackUrl);
          setError('Google AI free-tier quota is 0. Displaying locally enhanced version.');
          break;
        }

        if ((type === 'quota_exceeded' || type === 'rate_limit') && currentAttempt < maxAttempts) {
          // auto backoff countdown
          let seconds = delay;
          setAutoRetryCountdown(seconds);
          setProcessingStep(`⏳ Rate limited. Auto retry in ${seconds}s (attempt ${currentAttempt + 1}/${maxAttempts})...`);
          while (seconds > 0) {
            await sleep(1000);
            seconds -= 1;
            setAutoRetryCountdown(seconds);
          }
          defaultDelay = Math.min(120, delay * 2);
          continue;
        }

        // Not retryable or attempts exhausted → Try local fallback
        if (type === 'quota_exceeded' || type === 'rate_limit') {
          setProcessingStep('⚠️ Using local fallback enhancement...');
          const fallbackUrl = await applyLocalEnhancement(preprocessed);
          setEnhancedImage(fallbackUrl);
          setProcessingStep('✅ Local enhancement complete (approximate)');
          setError('Google AI quota exceeded. Displaying locally enhanced version.');
          break;
        }

        // Other errors → surface message but do not throw
        setError(result.error || 'Failed to enhance image');
        setProcessingStep('');
        break;
      }

    } catch (error) {
      console.error('Enhancement error:', error);
      setError(error instanceof Error ? error.message : 'Failed to enhance image');

      // Set retry option for certain error types
      if (errorType === 'quota_exceeded' || errorType === 'rate_limit') {
        setCanRetry(true);
      }
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProcessingStep(""), 2000);
    }
  };

  const downloadImage = () =>
  {
    if (!enhancedImage || !imageMetadata) return;

    const link = document.createElement('a');
    link.href = enhancedImage;
    link.download = `enhanced_${imageMetadata.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) =>
  {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950">
      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-200/50 dark:border-purple-800/50">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">AI-Powered Enhancement</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-900 via-pink-900 to-red-900 dark:from-purple-100 dark:via-pink-100 dark:to-red-100 bg-clip-text text-transparent">
            Property Image Enhancement
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Transform your property photos with Google&apos;s advanced Nano Banana AI technology.
            Upload, enhance, and download professional-quality images for your real estate listings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <Card className="lg:col-span-1 border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl rounded-3xl">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Upload Image</CardTitle>
                  <CardDescription>Drop your property image here</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragActive
                  ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20 scale-105"
                  : "border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl flex items-center justify-center">
                    <Camera className="h-8 w-8 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {isDragActive ? "Drop your image here!" : "Click or drag to upload"}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      Supports JPG, PNG, WebP up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Metadata */}
              {imageMetadata && (
                <Card className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 border-slate-200/50 dark:border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Image Properties
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-medium text-slate-600 dark:text-slate-400">Name:</span>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{imageMetadata.name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600 dark:text-slate-400">Size:</span>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{formatFileSize(imageMetadata.size)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600 dark:text-slate-400">Dimensions:</span>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {imageMetadata.dimensions.width} × {imageMetadata.dimensions.height}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600 dark:text-slate-400">Format:</span>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{imageMetadata.type}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Room Type Dropdown */}
              {originalImage && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">Select Room Type</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between rounded-xl">
                        <span className="truncate">
                          {({
                            living_room: 'Living Room',
                            bedroom: 'Bedroom',
                            kitchen: 'Kitchen',
                            bathroom: 'Bathroom',
                            dining_room: 'Dining Room',
                            office: 'Home Office',
                            outdoor: 'Outdoor',
                            other: 'Other',
                          } as Record<string, string>)[roomType]}
                        </span>
                        <span className="opacity-70">▼</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuLabel>Room Type</DropdownMenuLabel>
                      <DropdownMenuRadioGroup value={roomType} onValueChange={(v) => setRoomType(v as typeof roomType)}>
                        {([
                          ['living_room', 'Living Room'],
                          ['bedroom', 'Bedroom'],
                          ['kitchen', 'Kitchen'],
                          ['bathroom', 'Bathroom'],
                          ['dining_room', 'Dining Room'],
                          ['office', 'Home Office'],
                          ['outdoor', 'Outdoor'],
                          ['other', 'Other'],
                        ] as [string, string][]).map(([value, label]) => (
                          <DropdownMenuRadioItem key={value} value={value}>
                            {label}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {/* Design Theme Dropdown */}
              {originalImage && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">Select Design Theme</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between rounded-xl">
                        <span className="truncate capitalize">{designTheme}</span>
                        <span className="opacity-70">▼</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuLabel>Design Theme</DropdownMenuLabel>
                      <DropdownMenuRadioGroup value={designTheme} onValueChange={(v) => setDesignTheme(v as typeof designTheme)}>
                        {([
                          ['modern', 'Modern'],
                          ['minimalist', 'Minimalist'],
                          ['industrial', 'Industrial'],
                          ['scandinavian', 'Scandinavian'],
                          ['traditional', 'Traditional'],
                          ['bohemian', 'Bohemian'],
                          ['rustic', 'Rustic'],
                          ['coastal', 'Coastal'],
                          ['vintage', 'Vintage'],
                          ['luxury', 'Luxury'],
                        ] as [string, string][]).map(([value, label]) => (
                          <DropdownMenuRadioItem key={value} value={value}>
                            {label}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {/* New Design & Controls */}
              {originalImage && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => setVariantSeed(Math.floor(Math.random() * 1e6))} className="rounded-xl">New Design</Button>
                    <Button variant="outline" onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()} className="rounded-xl">Change Image</Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['subtle', 'balanced', 'bold'] as const).map(v => (
                      <Button key={v} variant={intensity === v ? "default" : "outline"} className="rounded-xl" onClick={() => setIntensity(v)}>
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </Button>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['fast', 'balanced', 'hq'] as const).map(v => (
                      <Button key={v} variant={speedProfile === v ? "default" : "outline"} className="rounded-xl" onClick={() => setSpeedProfile(v)}>
                        {v === 'hq' ? 'HQ' : v.charAt(0).toUpperCase() + v.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhancement Options */}
              {originalImage && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">Enhancement Type</h3>
                  <div className="space-y-2">
                    {Object.entries(enhancementOptions).map(([key, option]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedEnhancement(key as keyof EnhancementOptions)}
                        className={`w-full p-3 rounded-xl border-2 text-left transition-all duration-300 ${selectedEnhancement === key
                          ? "border-purple-400 bg-purple-50 dark:bg-purple-900/20 shadow-md"
                          : "border-slate-200 dark:border-slate-700 hover:border-purple-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          }`}
                      >
                        <div className="font-medium text-slate-900 dark:text-slate-100">{option.name}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">{option.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhance Button */}
              {originalImage && (
                <Button
                  onClick={enhanceImage}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl h-12 font-semibold"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{processingStep}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Generate Design · {roomType.replace('_', ' ')} · {designTheme}</span>
                    </div>
                  )}
                </Button>
              )}

              {/* Enhanced Error Display */}
              {error && (
                <Card className={`border-2 ${errorType === 'quota_exceeded'
                  ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
                  : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                  }`}>
                  <CardContent className="p-4 space-y-3">
                    <div className={`flex items-start gap-2 ${errorType === 'quota_exceeded'
                      ? 'text-orange-700 dark:text-orange-300'
                      : 'text-red-700 dark:text-red-300'
                      }`}>
                      <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="text-sm font-medium block mb-1">
                          {errorType === 'quota_exceeded' ? 'Quota Exceeded' : 'Enhancement Failed'}
                        </span>
                        <span className="text-sm leading-relaxed">{error}</span>
                      </div>
                    </div>

                    {/* Retry Section for Quota/Rate Limit Errors */}
                    {canRetry && (errorType === 'quota_exceeded' || errorType === 'rate_limit') && (
                      <div className="pt-2 border-t border-orange-200 dark:border-orange-800">
                        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
                          <div className="text-xs text-orange-600 dark:text-orange-400">
                            {retryAfter ? `Try again in ${Math.ceil(retryAfter / 60)} minutes` : 'You can try again later'}
                          </div>
                          <Button
                            onClick={enhanceImage}
                            disabled={isProcessing}
                            size="sm"
                            variant="outline"
                            className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900/20"
                          >
                            {isProcessing ? (
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            ) : (
                              "🔄"
                            )}
                            Retry
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Alternative Solution for Quota Issues */}
                    {errorType === 'quota_exceeded' && (
                      <div className="pt-2 border-t border-orange-200 dark:border-orange-800">
                        <div className="text-xs text-orange-600 dark:text-orange-400 space-y-1">
                          <p><strong>💡 Alternative solutions:</strong></p>
                          <ul className="list-disc list-inside pl-2 space-y-0.5">
                            <li>Wait a few minutes and try again</li>
                            <li>Use a different enhancement type</li>
                            <li>Try with a smaller image</li>
                            <li>Consider upgrading your Google AI plan</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Image Comparison Section */}
          <Card className="lg:col-span-2 border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl rounded-3xl">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl">
                  <ImageIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Before & After Comparison</CardTitle>
                  <CardDescription>See the AI enhancement results</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!originalImage ? (
                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-3xl flex items-center justify-center">
                      <FileImage className="h-12 w-12 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Upload an image to get started</h3>
                      <p className="text-slate-600 dark:text-slate-400">Your before and after comparison will appear here</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Original Image */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        📷 Original
                      </Badge>
                    </div>
                    <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={originalImage}
                        alt="Original property"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Enhanced Image */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={`${enhancedImage
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                          : "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
                          }`}
                      >
                        {enhancedImage ? "✨ Enhanced" : "⏳ Waiting"}
                      </Badge>
                      {enhancedImage && (
                        <Button
                          onClick={downloadImage}
                          size="sm"
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg rounded-xl"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                    <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
                      {enhancedImage ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={enhancedImage}
                            alt="Enhanced property"
                            className="w-full h-full object-cover"
                          />
                        </>
                      ) : isProcessing ? (
                        <div className="text-center space-y-4">
                          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto" />
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">Processing...</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{processingStep}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-4">
                          <Zap className="h-12 w-12 text-slate-400 mx-auto" />
                          <p className="text-slate-600 dark:text-slate-400">Enhanced image will appear here</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Processing Status */}
              {processingStep && !isProcessing && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800 rounded-2xl">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">{processingStep}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Lightning Fast</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Process images in seconds with optimized AI algorithms
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">AI-Powered</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Advanced Google Nano Banana AI for professional results
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Multiple Styles</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Choose from professional, brightness, contrast & color modes
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Easy Download</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Download high-quality enhanced images instantly
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}