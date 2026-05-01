import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
const { Image } = require('react-native') as { Image: React.ComponentType<any> };
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileCard } from '@/components/ProfileCard';
import axios from 'axios';
import { API_URL } from '@/constants/Config';

export default function AboutScreen() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const oguduhistory = [
    `CCC Ogudu Expressway Cathedral was founded in 1977 through divine intervention and prophetic messages. The word of God came to Superior Leader Asooto in the third quarter of 1977, directing the establishment of a parish in Ogudu, a village at the time. The land, formerly used for a poultry farm belonging to Superior Leader Asooto, was converted into a place of worship. A young girl prophesied that the church would bear the torch, and Senior Evangelist Oladapo, along with Superior Leader Asooto, fulfilled the word of God by establishing the parish.`,
    `The parish was initially erected with temporary structures like bamboo, poles, and palm fronds, in obedience to the divine directive. Despite the makeshift nature of the building, God assured that it would not rain on the site in a way that would disturb worshippers until a more permanent structure could be built. This promise was dramatically fulfilled when it rained heavily around the town but not on the church site. The parish experienced rapid growth and miracles, attracting attention and support from both members and well-wishers.`,
    `Under the leadership of various shepherds, including Senior Evangelist Oladapo, Superior Evangelist J.B. Adelaja, and others, the church flourished. Chief Bola Adewunmi, who was approached by a prophet of the church, single-handedly completed the first permanent structure and became a worshipper in the parish. The church has since grown, with notable contributions from members and the fulfillment of prophecies about its future. Today, the CCC Ogudu Expressway Cathedral stands as a testament to faith and divine providence, with a rich history and a vibrant community.`
  ];

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/dbhandler?model=churchsections`);
        setSections(res.data);
      } catch (e) {
        console.error("Fetch hierarchy error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1">
        <View className="px-6 py-10">
          <Text className="text-4xl font-bold">About <Text className="text-accent">us</Text></Text>
          
          <View className="mt-8">
            <Text className="text-lg font-semibold text-accent mb-4">Brief history of the foundation of CCC Ogudu</Text>
            {oguduhistory.map((p, i) => (
              <Text key={i} className="text-foreground/80 text-base mb-4 leading-6">    {p}</Text>
            ))}
          </View>

          <View className="flex-row flex-wrap justify-between mt-10">
            <ProfileCard name="Papa Oshoffa" title="Pastor Founder" image="https://cccogudu.vercel.app/papaoshofa.jpg" />
            <ProfileCard name="Reverend EMF Oshoffa" title="Current Pastor" image="https://cccogudu.vercel.app/pastor.jpg" />
            <ProfileCard name="Shepherd Name" title="Shepherd" image="https://cccogudu.vercel.app/shephard.jpg" />
            <ProfileCard name="Asst Shepherd Name" title="Asst Shepherd" image="https://cccogudu.vercel.app/shephardasst.jpg" />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#F97316" className="mt-10" />
          ) : (
            sections.map((section) => (
              <View key={section.id} className="mt-16 items-center w-full">
                <Text className="text-2xl font-bold text-center">Meet the <Text className="text-accent">{section.name}</Text></Text>
                <View className="flex-row flex-wrap justify-center gap-4 mt-8 w-full">
                  {section.members.map((member: any) => (
                    <View key={member.id} className="items-center w-[45%] mb-6">
                      <Image
                        source={{ uri: member.pictureUrl || 'https://cccogudu.vercel.app/placeholderMale.jpg' }}
                        className="w-20 h-20 rounded-full mb-2"
                      />
                      <Text className="font-bold text-center text-sm text-foreground">{member.name}</Text>
                      <Text className="text-xs text-center text-muted-foreground">{member.position}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </View>
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
