import type { CertificationExam } from '@/models/CertificationExam'
import type { Provider } from '@/models/Provider'

export const providers: Provider[] = [
  {
    id: 'aws',
    name: 'Amazon Web Services',
    logo: '/logos/aws.svg',
    color: '#232f3e',
  },
]

export const certifications: CertificationExam[] = [
  {
    id: 'saa-c03',
    providerId: 'aws',
    code: 'SAA-C03',
    name: 'AWS Certified Solutions Architect - Associate',
    description:
      'Validate technical expertise in designing and deploying distributed systems on AWS.',
    version: 'SAA-C03',
    difficulty: 'medium',
    isActive: true,
    imageUrl: '/images/aws-saa-c03.png',
  },
]
