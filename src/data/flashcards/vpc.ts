import type { Deck } from "@/features/flashcard/types";

export const vpcDeck: Deck = {
	id: "aws-vpc",
	title: "AWS VPC",
	description: "AWS Virtual Private Cloudに関する基礎知識",
	cards: [
		{
			id: "vpc-1",
			question: "VPCの正式名称は？",
			answer: "Virtual Private Cloud\n（バーチャル・プライベート・クラウド）",
		},
		{
			id: "vpc-2",
			question: "VPCとは一言で言うと？",
			answer: "AWS上に作る自分専用の仮想ネットワーク",
		},
		{
			id: "vpc-3",
			question: "VPCで使用されるIPアドレスは\nパブリック？プライベート？",
			answer:
				"プライベートIPアドレス\n\n他のVPCと重複してもOK\n（完全に分離されているため）",
		},
		{
			id: "vpc-4",
			question: "プライベートIPアドレスの3つの範囲は？",
			answer: "10.0.0.0/8\n172.16.0.0/12\n192.168.0.0/16\n\n（RFC 1918で定義）",
		},
		{
			id: "vpc-5",
			question: "デフォルトVPCのCIDRは？",
			answer: "172.31.0.0/16",
		},
		{
			id: "vpc-6",
			question: "デフォルトVPCが最初から持っているものは？\n（4つ）",
			answer:
				"・インターネットゲートウェイ\n・ルートテーブル（設定済み）\n・サブネット（各AZに1つ）\n・パブリックIP自動付与の設定",
		},
		{
			id: "vpc-7",
			question: "CIDRの正式名称は？",
			answer:
				"Classless Inter-Domain Routing\n（クラスレス・インタードメイン・ルーティング）",
		},
		{
			id: "vpc-8",
			question: "CIDR「10.0.0.0/16」の\n/16 は何を意味する？",
			answer:
				"ネットワーク部のビット数\n\n32ビット中16ビットが固定\n→ 残り16ビットがホスト部（使えるIP）",
		},
		{
			id: "vpc-9",
			question: "/24 で使えるIPアドレスは約何個？",
			answer:
				"約254個\n\n計算：2^(32-24) - 2 = 254\n（-2はネットワークアドレスとブロードキャスト分）",
		},
		{
			id: "vpc-10",
			question: "/16 で使えるIPアドレスは約何個？",
			answer: "約65,534個\n\n計算：2^(32-16) - 2 = 65,534",
		},
		{
			id: "vpc-11",
			question: "CIDRの数字が大きいほど\nIPアドレスの範囲は？",
			answer:
				"狭くなる\n\n/8 → 約1,677万個（広い）\n/24 → 約254個\n/32 → 1個のみ（狭い）",
		},
		{
			id: "vpc-12",
			question: "インターネットゲートウェイ（IGW）の役割は？",
			answer:
				"VPCとインターネットを繋ぐ出入口\n\nパブリックIP ⇔ プライベートIP の変換を行う",
		},
		{
			id: "vpc-13",
			question: "EC2がインターネットと通信するために\n必要なものは？（4つ）",
			answer:
				"1. インターネットゲートウェイ\n2. ルートテーブル（IGWへの経路）\n3. パブリックIP\n4. セキュリティグループ（通信許可）",
		},
		{
			id: "vpc-14",
			question: "インターネットゲートウェイと\nAPIゲートウェイの違いは？",
			answer:
				"IGW：ネットワーク層\n　→ VPCとインターネットを繋ぐ\n\nAPI Gateway：アプリケーション層\n　→ APIのエンドポイントを管理",
		},
		{
			id: "vpc-15",
			question: "VPCの【中】に作るサービスは？\n（4つ例を挙げよ）",
			answer:
				"・EC2\n・RDS\n・ElastiCache\n・ELB（ロードバランサー）\n\n→ サブネット、セキュリティグループを指定",
		},
		{
			id: "vpc-16",
			question: "VPCの【外】に存在するサービスは？\n（4つ例を挙げよ）",
			answer:
				"・Lambda（デフォルト）\n・API Gateway\n・S3\n・DynamoDB\n\n→ AWSが管理、ネットワーク設定不要",
		},
		{
			id: "vpc-17",
			question: "Lambdaはデフォルトで\nVPCの中？外？",
			answer:
				"外\n\nただし設定でVPC内に置くことも可能\n（RDSにアクセスしたい場合など）",
		},
		{
			id: "vpc-18",
			question: "API Gateway + Lambda構成で\n自分でIGWは必要？",
			answer: "不要\n\n両方ともVPCの外にあり\nAWSが管理するため",
		},
		{
			id: "vpc-19",
			question: "リージョンとは？",
			answer:
				"AWSの地理的な場所\n\n例：東京（ap-northeast-1）、大阪、バージニア\n\n各リージョンは完全に独立",
		},
		{
			id: "vpc-20",
			question: "AZ（アベイラビリティゾーン）とは？",
			answer:
				"リージョン内のデータセンター群\n\n・物理的に離れている（災害対策）\n・低遅延で接続されている\n・1リージョンに通常3つ以上",
		},
		{
			id: "vpc-21",
			question: "リージョン・VPC・AZ・サブネットの\n階層関係は？",
			answer:
				"リージョン\n　└── VPC（AZをまたぐ）\n　　　　└── サブネット（1つのAZに固定）",
		},
		{
			id: "vpc-22",
			question: "VPCとAZの関係は？",
			answer:
				"VPCはAZをまたいで存在する\n\n1つのVPC内に、複数のAZにまたがってサブネットを配置できる",
		},
		{
			id: "vpc-23",
			question: "サブネットとは？",
			answer:
				"VPCをさらに小さく分割したネットワーク区画\n\n・1つのAZに固定（またげない）\n・パブリック/プライベートに分けて使う",
		},
		{
			id: "vpc-24",
			question: "サブネットとAZの関係は？",
			answer:
				"サブネットは必ず1つのAZに属する\n\n・1つのAZ → 複数のサブネットを持てる\n・1つのサブネット → 1つのAZのみ",
		},
		{
			id: "vpc-25",
			question: "パブリックサブネットと\nプライベートサブネットの違いは？",
			answer:
				"ルートテーブルの設定の違い\n\nパブリック：IGWへの経路あり\n　→ インターネットと通信可\n\nプライベート：IGWへの経路なし\n　→ 直接アクセス不可",
		},
		{
			id: "vpc-26",
			question: "なぜサブネットを分割するのか？\n（3つ）",
			answer:
				"1. 公開/非公開を分ける\n　（Web層とDB層）\n\n2. 可用性を高める\n　（複数AZに配置）\n\n3. 管理しやすくする\n　（役割ごとにセキュリティ設定）",
		},
		{
			id: "vpc-27",
			question: "ルートテーブルとは？",
			answer:
				"ネットワークの通信経路を決める設定表\n\n「この宛先に行きたいときは、ここを通れ」という指示書",
		},
		{
			id: "vpc-28",
			question: "ルートテーブルの「0.0.0.0/0」とは？",
			answer:
				"全てのIPアドレスを意味する\n（デフォルトルート）\n\n「他のルールに一致しない通信は全部ここへ」",
		},
		{
			id: "vpc-29",
			question: "VPCとサブネットのCIDRの関係ルールは？",
			answer:
				"1. サブネットはVPCの範囲内\n2. サブネットはVPCより小さい\n3. サブネット同士は重複不可\n\n例：VPC /16 → サブネット /24",
		},
		{
			id: "vpc-30",
			question: "VPC 10.0.0.0/16 に対して\nサブネット 10.1.0.0/24 は作成可能？",
			answer:
				"不可能\n\nVPCの範囲：10.0.0.0 〜 10.0.255.255\n10.1.x.x は範囲外",
		},
	],
};
