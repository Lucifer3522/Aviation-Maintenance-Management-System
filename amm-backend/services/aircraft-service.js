// Import Required Modules
import mongoose from 'mongoose';

//Import Required Local Modules
import logger from '../utils/logger.js';

// Import Models
import Aircraft from '../models/aircraft-model.js';
import AircraftModel from '../models/aircraft-model-model.js';
import MPD from '../models/mpd-model.js';
import MaintenancePackage from '../models/mp-model.js';

// Aircraft Service Class
class AircraftService {
    async createAircraft(aircraftData) {
        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
            const aircraft = new Aircraft(aircraftData);
            await aircraft.save({ session });
            
            const mpds = await MPD.find({ 
                aircraftModelId: aircraftData.aircraftModelId,
                isActive: true 
            }).session(session);
            
            if (mpds.length === 0) {
                logger.dropInfo("SERVICE",`MPDs not Found - ${aircraftData.aircraftModelId}`);
            }
            
            const mpdsType = mpds.reduce((acc, mpd) => {
                const checkType = mpd.checkType;
                if (!acc[checkType]) {
                    acc[checkType] = [];
                }
                acc[checkType].push(mpd);
                return acc;
            }, {});
            
            const MPS = [];
            
            for (const [checkType, checkMpds] of Object.entries(mpdsType)) {
                const mpdItems = checkMpds.map(mpd => ({
                    mpdId: mpd._id,
                    task: mpd.task,
                    code: mpd.code,
                    maintenance: mpd.maintenance,
                    status: 'Pending',
                    lastDone: null,
                    nextDue: null
                }));
                
                const packageName = `${checkType} Package - ${aircraftData.registration}`;
                
                const MP = new MaintenancePackage({
                    aircraftId: aircraft._id,
                    checkType: checkType,
                    name: packageName,
                    mpdItems: mpdItems,
                    status: 'Scheduled',
                    station: aircraftData.station,
                    totalEstimatedHours: checkMpds.reduce((sum, mpd) => 
                        sum + (mpd.estimatedManHours || 0), 0)
                });
                
                await MP.save({ session });
                MPS.push(MP);
            }
            
            await session.commitTransaction();
            
            return {
                aircraft,
                maintenancePackages: MPS,
                message: `Aircraft ${aircraftData.registration} Created - ${MPS.length}`
            };
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    async getAircraft(aircraftId) {
        return await Aircraft.findById(aircraftId)
            .populate('aircraftModelId')
            .exec();
    }
    
    async getMP(aircraftId) {
        return await MaintenancePackage.find({ aircraftId })
            .populate('mpdItems.mpdId')
            .sort({ checkType: 1 })
            .exec();
    }
    
    async getMPDs(aircraftId) {
        const aircraft = await Aircraft.findById(aircraftId);
        if (!aircraft) {
            throw new Error('Aircraft not Found');
        }
        
        return await MPD.find({ 
            aircraftModelId: aircraft.aircraftModelId,
            isActive: true 
        }).sort({ checkType: 1, task: 1 }).exec();
    }
    
    async updateMPD(packageId, mpdItemId, updateData) {
        const MP = await MaintenancePackage.findById(packageId);

        if (!MP) {
            throw new Error('Maintenance Package not Found');
        }
        
        const mpdItem = MP.mpdItems.id(mpdItemId);
        
        if (!mpdItem) {
            throw new Error('MPD item not Found');
        }
        
        Object.assign(mpdItem, updateData);

        await MP.save();

        return MP;
    }
    
    async updateMPItemStatus(packageId, mpdItemId, updateData) {
        const MP = await MaintenancePackage.findById(packageId);

        if (!MP) {
            throw new Error('Maintenance Package not Found');
        }
        
        const mpdItem = MP.mpdItems.id(mpdItemId);
        
        if (!mpdItem) {
            throw new Error('MPD item not Found');
        }
        
        Object.assign(mpdItem, updateData);

        await MP.save();

        return MP;
    }
}

// Export Service Module
export default new AircraftService();
