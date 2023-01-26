
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';


export class Ec2InstanceCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, {
      ...props, env: {
        account: "381010156594",
        region: "eu-west-1"
      }
    });
    const defaultVpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true })

    const securityGroup = new ec2.SecurityGroup(this,
      'tungnguyen-instance-sg',
      {
        vpc: defaultVpc,
        allowAllOutbound: true,
        securityGroupName: "tungnguyen-instance-sg"
      }
    );

    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow http');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow https');

    const instance = new ec2.Instance(this, 'tungnguyen-cdk-instance', {
      vpc: defaultVpc,
      securityGroup: securityGroup,
      instanceName: "tungnguyen-cdk-instance",
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2
      }),
      keyName: 'tungnguyen-cdk-instance-key'
    });

    new cdk.CfnOutput(this, 'stack output', {
      value: instance.instancePublicIp
    })
  }
}
