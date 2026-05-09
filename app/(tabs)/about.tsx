import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Screen, Section, PageHeader } from '@/components/layout';
import { ProfileCard } from '@/components/shared';
import { Button } from '@/components/ui';
import { useAppContext } from '@/context/AppContext';
import { useHierarchy, useHierarchyActions } from '@/hooks/useChurch';
import { Trash2, Edit, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const OGUDU_HISTORY = [
  "CCC Ogudu Expressway Cathedral was founded in 1977 through divine intervention and prophetic messages. The word of God came to Superior Leader Asooto in the third quarter of 1977, directing the establishment of a parish in Ogudu, a village at the time.",
  "The parish was initially erected with temporary structures like bamboo, poles, and palm fronds, in obedience to the divine directive. Despite the makeshift nature of the building, God assured that it would not rain on the site in a way that would disturb worshippers until a more permanent structure could be built.",
  "Today, the CCC Ogudu Expressway Cathedral stands as a testament to faith and divine providence, with a rich history and a vibrant community."
];

const FOUNDERS = [
  { name: 'Papa Oshofa', title: 'Pastor Founder', img: 'https://cccogudu.vercel.app/papaoshofa.jpg' },
  { name: 'Rev EMF Oshoffa', title: 'Current Pastor', img: 'https://cccogudu.vercel.app/pastor.jpg' },
  { name: 'Shepherd', title: 'Shepherd', img: 'https://cccogudu.vercel.app/shephard.jpg' },
  { name: 'Asst Shepherd', title: 'Asst Shepherd', img: 'https://cccogudu.vercel.app/shephardasst.jpg' },
];

export default function AboutScreen() {
  const { user } = useAppContext();
  const router = useRouter();
  const { data: sections, isLoading } = useHierarchy();
  const { deleteSection, deleteMember } = useHierarchyActions();

  const handleDeleteSection = (id: string, name: string) => {
    Alert.alert("Delete Group", `Delete ${name} and all members?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteSection(id) }
    ]);
  };

  const handleDeleteMember = (id: string, name: string) => {
    Alert.alert("Remove Member", `Remove ${name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => deleteMember(id) }
    ]);
  };

  return (
    <Screen safe={true}>
      <PageHeader title="About" accentTitle="us" subtitle="Brief history of the foundation" />

      <Section className="py-0">
        <View className="mb-8">
          {OGUDU_HISTORY.map((para, i) => (
            <Text key={i} className="text-gray-600 text-base leading-relaxed mb-4">
              {para}
            </Text>
          ))}
        </View>

        <View className="flex-row flex-wrap justify-between">
          {FOUNDERS.map((f, i) => (
            <ProfileCard key={i} name={f.name} title={f.title} profileImage={f.img} />
          ))}
        </View>
      </Section>

      <Section title="Church" accentTitle="Hierarchy" description="Meet our committees and groups">
        {isLoading ? (
          <ActivityIndicator size="large" color="#f59e0b" className="py-20" />
        ) : (
          sections?.map((section: any) => {
            const availableYears = section.members?.map((m: any) => m.year) || [];
            const sortedYears = [...new Set(availableYears)].sort((a: any, b: any) => b.localeCompare(a));
            const maxYear = sortedYears[0];
            const latestMembers = section.members?.filter((m: any) => m.year === maxYear) || [];

            if (latestMembers.length === 0 && user?.role !== 'admin') return null;

            return (
              <View key={section.id} className="mb-12 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                <View className="flex-row items-center justify-between mb-6">
                  <View>
                    <Text className="text-2xl font-black text-gray-900">{section.name}</Text>
                    {typeof maxYear === 'string' && <Text className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Tenure {maxYear}</Text>}
                  </View>
                  
                  {user?.role === 'admin' && (
                    <View className="flex-row gap-2">
                      <TouchableOpacity onPress={() => handleDeleteSection(section.id, section.name)} className="p-2 bg-red-50 rounded-full">
                        <Trash2 size={20} color="#ef4444" />
                      </TouchableOpacity>
                      <TouchableOpacity className="p-2 bg-accent/10 rounded-full">
                        <Edit size={20} color="#f59e0b" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                  {latestMembers.map((member: any) => (
                    <View key={member.id} className="mr-4 relative">
                      <ProfileCard 
                        name={member.name} 
                        title={member.position} 
                        profileImage={member.pictureUrl || 'https://res.cloudinary.com/dc5khnuiu/image/upload/v1752627019/uxokaq0djttd7gsslwj9.png'} 
                      />
                      {user?.role === 'admin' && (
                        <TouchableOpacity 
                          onPress={() => handleDeleteMember(member.id, member.name)}
                          className="absolute top-4 right-4 p-2 bg-red-500 rounded-full shadow-sm"
                        >
                          <Trash2 size={12} color="white" />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                  {user?.role === 'admin' && (
                    <TouchableOpacity className="w-44 h-56 items-center justify-center bg-white rounded-2xl m-2 border-2 border-dashed border-gray-200">
                      <Plus size={32} color="#94a3b8" />
                      <Text className="text-xs font-bold text-gray-400 mt-2">Add Member</Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </View>
            );
          })
        )}
      </Section>

      {user?.role === 'admin' && (
        <Section className="items-center pb-20">
          <Button variant="ghost" className="justify-start h-16 px-6 mb-2 rounded-3xl bg-accent/5" onPress={() => router.push('/admin' as any)}>
            Manage Hierarchy
          </Button>
        </Section>
      )}

      <View className="h-20" />
    </Screen>
  );
}
