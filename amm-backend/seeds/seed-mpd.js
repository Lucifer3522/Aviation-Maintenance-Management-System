import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AircraftModel from '../models/aircraft-model-model.js';
import MPD from '../models/mpd-model.js';

dotenv.config();

const mpdTemplates = [
    {
        task: 'Engine Oil Change',
        code: 'MP001',
        maintenance: 'Replace engine oil and filter',
        checkType: 'A-Check',
        ataChapter: '7300',
        estimatedManHours: 2,
        criticalityLevel: 'High'
    },
    {
        task: 'Hydraulic System Inspection',
        code: 'MP002',
        maintenance: 'Check hydraulic fluids and inspect hoses',
        checkType: 'B-Check',
        ataChapter: '2900',
        estimatedManHours: 3,
        criticalityLevel: 'High'
    },
    {
        task: 'Brake Pad Inspection',
        code: 'MP003',
        maintenance: 'Inspect and measure brake pad wear',
        checkType: 'A-Check',
        ataChapter: '3200',
        estimatedManHours: 1.5,
        criticalityLevel: 'Medium'
    },
    {
        task: 'Landing Gear Inspection',
        code: 'MP004',
        maintenance: 'Visual inspection of landing gear and actuators',
        checkType: 'B-Check',
        ataChapter: '3200',
        estimatedManHours: 4,
        criticalityLevel: 'Critical'
    },
    {
        task: 'Fuel System Check',
        code: 'MP005',
        maintenance: 'Check fuel quantity, filters, and system pressures',
        checkType: 'A-Check',
        ataChapter: '2800',
        estimatedManHours: 2.5,
        criticalityLevel: 'High'
    },
    {
        task: 'Avionics System Test',
        code: 'MP006',
        maintenance: 'Functional test of navigation and communication systems',
        checkType: 'C-Check',
        ataChapter: '3400',
        estimatedManHours: 6,
        criticalityLevel: 'High'
    },
    {
        task: 'Tire Inspection',
        code: 'MP007',
        maintenance: 'Check tire pressure, tread depth, and damage',
        checkType: 'A-Check',
        ataChapter: '3200',
        estimatedManHours: 1,
        criticalityLevel: 'Medium'
    },
    {
        task: 'Battery System Check',
        code: 'MP008',
        maintenance: 'Test battery voltage and replacement if required',
        checkType: 'A-Check',
        ataChapter: '2400',
        estimatedManHours: 1.5,
        criticalityLevel: 'Medium'
    },
    {
        task: 'Exterior Inspection',
        code: 'MP009',
        maintenance: 'Comprehensive visual inspection of fuselage and surfaces',
        checkType: 'B-Check',
        ataChapter: '5700',
        estimatedManHours: 3,
        criticalityLevel: 'Medium'
    },
    {
        task: 'Interior Lighting System',
        code: 'MP010',
        maintenance: 'Test all interior and exterior lighting',
        checkType: 'A-Check',
        ataChapter: '3300',
        estimatedManHours: 2,
        criticalityLevel: 'Low'
    }
];

async function seedMPD() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Get all aircraft models
        const aircraftModels = await AircraftModel.find({}).exec();
        
        if (aircraftModels.length === 0) {
            console.log('❌ No aircraft models found. Please create aircraft models first.');
            process.exit(1);
        }

        console.log(`📦 Found ${aircraftModels.length} aircraft models`);

        let totalCreated = 0;

        // Create 10 MPD records for each aircraft model
        for (const aircraftModel of aircraftModels) {
            console.log(`\n📝 Creating MPD records for: ${aircraftModel.manufacturer} ${aircraftModel.model}`);

            for (let i = 0; i < mpdTemplates.length; i++) {
                const template = mpdTemplates[i];
                
                // Check if MPD already exists
                const existing = await MPD.findOne({
                    aircraftModelId: aircraftModel._id,
                    code: template.code
                });

                if (existing) {
                    console.log(`   ⏭️  Skipping ${template.code} (already exists)`);
                    continue;
                }

                const mpdData = {
                    aircraftModelId: aircraftModel._id,
                    manufacturer: aircraftModel.manufacturer,
                    engineType: aircraftModel.engineType || 'Not Specified',
                    task: template.task,
                    code: template.code,
                    maintenance: template.maintenance,
                    checkType: template.checkType,
                    ataChapter: template.ataChapter,
                    estimatedManHours: template.estimatedManHours,
                    criticalityLevel: template.criticalityLevel,
                    isActive: true,
                    description: `Standard maintenance procedure for ${aircraftModel.manufacturer} ${aircraftModel.model}`,
                    cal_fc: 0,
                    cal_fh: 0,
                    period: 'As Required'
                };

                const mpd = new MPD(mpdData);
                await mpd.save();
                console.log(`   ✅ Created: ${template.code} - ${template.task}`);
                totalCreated++;
            }
        }

        console.log(`\n🎉 Successfully created ${totalCreated} MPD records!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding MPD data:', error.message);
        process.exit(1);
    }
}

seedMPD();
