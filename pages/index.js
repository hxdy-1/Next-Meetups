import MeetupList from "@/components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import Head from "next/head";

const Home = (props) => {
	return (
		<>
			<Head>
				<title>Next Meetups</title>
				<meta
					name="description"
					content="Browse a huge list of Next Meetups"
				/>
			</Head>
			<MeetupList meetups={props.meetups} />
		</>
	);
};

// this will run on server, for every incoming request and will regenerate the whole page.
// export async function getServerSideProps({ req, res }) {
// 	return {
// 		props: {
// 			meetups: DUMMY_MEETUPS,
// 		},
// 	};
// }

// this will be exeucuted only when we deploy the application
export async function getStaticProps() {
	const client = await MongoClient.connect(
		"mongodb+srv://hadimomin02:whatever890@cluster0.gdp0v0s.mongodb.net/MEETUPS?retryWrites=true&w=majority&appName=AtlasApp"
	);

	const db = client.db();

	const meetupsCollection = db.collection("meetups");

	const meetups = await meetupsCollection.find().toArray();

	client.close();

	return {
		props: {
			meetups: meetups.map((meetup) => ({
				title: meetup.title,
				address: meetup.address,
				image: meetup.image,
				id: meetup._id.toString(),
			})),
		},
		revalidate: 1,
	};
}

export default Home;
