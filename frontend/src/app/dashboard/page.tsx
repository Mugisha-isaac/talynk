// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Loader2 } from 'lucide-react';
// import { supabase } from '@/lib/supabase/client';

// export default function DashboardPage() {
//   const router = useRouter();

//   useEffect(() => {
//     const redirectToDashboard = async () => {
//       try {
//         const { data: { user } } = await supabase.auth.getUser();

//         if (!user) {
//           router.push('/auth/login');
//           return;
//         }

//         // TODO: Fetch user role from database and redirect accordingly
//         // For now, redirect to talent dashboard
//         router.push('/dashboard/talent');
//       } catch (error) {
//         console.error('Error:', error);
//         router.push('/auth/login');
//       }
//     };

//     redirectToDashboard();
//   }, [router]);

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//     </div>
//   );
// }
