import { catchasync } from "../../../shared/cathAsync";
import { voteService } from "./vote.service";
import { sendResponse } from "../../../shared/sendResponse";
import AppError from "../../errorHelper.ts/AppError";
import status from "http-status";
const createVote = catchasync(async (req, res) => {
    const ideaid = req.params.id;
    console.log("ideaId in controller:", ideaid);
    if (!ideaid) {
        throw new AppError(status.BAD_REQUEST, "Idea id is required");
    }
    if (!req.user) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
    }
    const result = await voteService.createVote(req.body, req.user, ideaid);
    sendResponse(res, {
        httpStatusCode: 201,
        success: true,
        message: "Vote created successfully",
        data: result,
    });
});
const countUpVotes = catchasync(async (req, res) => {
    const ideaId = req.params.id;
    const result = await voteService.countUpVotes(ideaId);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Up-vote count retrieved successfully",
        data: result,
    });
});
const countDownVotes = catchasync(async (req, res) => {
    const ideaId = req.params.id;
    const result = await voteService.countDownVotes(ideaId);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Down-vote count retrieved successfully",
        data: result,
    });
});
const removeVote = catchasync(async (req, res) => {
    const result = await voteService.removeVote(req.body, req.user);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Vote removed successfully",
        data: result,
    });
});
export const voteController = {
    createVote,
    countUpVotes,
    countDownVotes,
    removeVote,
};
