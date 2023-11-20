import React from "react";
import MeetupDetail from "@/components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";

const MeetupDetails = ({ meetupData }) => {
	return (
		<>
			<Head>
				<title>{meetupData.title}</title>
				<meta name="description" content={meetupData.description} />
			</Head>
			<MeetupDetail
				image={meetupData.image}
				title={meetupData.title}
				address={meetupData.address}
				description={meetupData.description}
			/>
		</>
	);
};

export async function getStaticPaths() {
	const client = await MongoClient.connect(
		"mongodb+srv://hadimomin02:whatever890@cluster0.gdp0v0s.mongodb.net/MEETUPS?retryWrites=true&w=majority&appName=AtlasApp"
	);

	const db = client.db();

	const meetupsCollection = db.collection("meetups");

	const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

	client.close();

	return {
		fallback: "blocking",
		paths: meetups.map((meetup) => ({
			params: { meetupId: meetup._id.toString() },
		})),
	};
}

export async function getStaticProps({ params }) {
	const client = await MongoClient.connect(
		"mongodb+srv://hadimomin02:whatever890@cluster0.gdp0v0s.mongodb.net/MEETUPS?retryWrites=true&w=majority&appName=AtlasApp"
	);

	const db = client.db();

	const meetupsCollection = db.collection("meetups");

	const selectedMeetup = await meetupsCollection.findOne({
		_id: new ObjectId(params.meetupId),
	});

	client.close();

	return {
		props: {
			meetupData: {
				id: selectedMeetup._id.toString(),
				title: selectedMeetup.title,
				address: selectedMeetup.address,
				image: selectedMeetup.image,
				description: selectedMeetup.description,
			},
		},
	};
}

export default MeetupDetails;
