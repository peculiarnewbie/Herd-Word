'use client';

import Image from 'next/image'
import styles from '../app/page.module.css'

import TextInput from '../components/TextInput'
import DefaultForm from '../components/Form';
import TestButton from '../components/TestButton';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';

import Ably from 'ably'
import { useEffect, useState } from 'react';

type MyPageProps = {
  text: string;
}

const lmaoo = "cmooon"

let globalChannel:Ably.Types.RealtimeChannelPromise;

export default function Home({
  thing,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  useEffect(() => {
    async function AblySubscribe(){
      const ably = new Ably.Realtime.Promise('Hgkx7A.855WWQ:G5X9DQEhQSB97zTtT0GdJb_I9monkLkJZjPbdhgR7b0');
      await ably.connection.once('connected');
      console.log('Connected to Ably!');
    
      globalChannel = ably.channels.get('quickstart');
      await globalChannel.subscribe('greeting', (message) => {
        console.log('Received a greeting message in realtime: ' + message.data.name + ' ' + message.data.answer)
      });
    }

    AblySubscribe()

    return () => {
      globalChannel.detach();
  	};

  }, []);

  
  const AblyTest = async () => {
    await globalChannel.publish('greeting', {name: "madafakaa", answer:"elegiga"});
    
  }

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <div>
          <TextInput></TextInput>
          <DefaultForm></DefaultForm>
        </div>
        <TestButton AblyTest={AblyTest}></TestButton>
        <p>{thing.text}</p>
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className={styles.grid}>
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore the Next.js 13 playground.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<{
  thing: MyPageProps;
}> = async() => {
  const thing = {text: "cmooon"} as MyPageProps;
  console.log("haha")

  return {
      props: {
          thing
      }
  }
}