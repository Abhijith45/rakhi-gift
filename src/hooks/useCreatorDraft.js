/**
 * Creator Draft Persistence Hook
 * Handles local storage persistence of draftId & schema version,
 * and hydrates state from the backend database on reload.
 */

import { useEffect, useCallback } from 'react';
import { getGiftDraft, createDraftGift, updateGiftDraft } from '../services/api.js';

const LOCAL_DRAFT_KEY = 'rakhi_creator_draft_id';
const LOCAL_SCHEMA_VERSION_KEY = 'rakhi_creator_schema_version';
const CURRENT_SCHEMA_VERSION = 1;

export function useCreatorDraft(builderData, setBuilderData, setUIState) {
  // 1. Initial hydration on page load
  useEffect(() => {
    let isMounted = true;

    async function hydrateDraft() {
      const storedDraftId = localStorage.getItem(LOCAL_DRAFT_KEY);
      const storedVersion = parseInt(localStorage.getItem(LOCAL_SCHEMA_VERSION_KEY) || '0', 10);

      if (!storedDraftId || storedVersion !== CURRENT_SCHEMA_VERSION) {
        // Schema mismatch or no stored draft -> start fresh
        localStorage.removeItem(LOCAL_DRAFT_KEY);
        localStorage.setItem(LOCAL_SCHEMA_VERSION_KEY, String(CURRENT_SCHEMA_VERSION));
        return;
      }

      try {
        setUIState((prev) => ({ ...prev, restoringDraft: true }));
        const draft = await getGiftDraft(storedDraftId);

        if (isMounted && draft) {
          setBuilderData((prev) => ({
            ...prev,
            draftId: draft.id,
            giftSlug: draft.slug || prev.giftSlug,
            senderName: draft.senderName || '',
            recipientName: draft.recipientName || '',
            relationship: draft.relationship || 'Sister',
            senderNickname: draft.senderNickname || '',
            recipientNickname: draft.recipientNickname || '',
            creatorEmail: draft.creatorEmail || '',
            plan: (draft.plan || 'PREMIUM').toUpperCase(),
            theme: draft.theme || 'warm-memory',
            message: draft.message || '',
            photos: draft.photos || [],
            reasons: draft.reasons && draft.reasons.length > 0 ? draft.reasons : [],
            memories: draft.memories && draft.memories.length > 0
              ? draft.memories.map((m) => ({
                  id: m.id,
                  date: m.date,
                  title: m.title,
                  description: m.description,
                  photoId: m.photoId,
                  imageUrl: m.photo?.url || m.imageUrl || null,
                  thumbnailUrl: m.thumbnailUrl || m.photo?.thumbnailUrl || m.photo?.url || m.imageUrl || null,
                  displayOrder: m.displayOrder
                }))
              : [],
            funItems: draft.funItems && draft.funItems.length > 0
              ? draft.funItems.map((f) => ({
                  id: f.id,
                  question: f.question,
                  answer: f.answer,
                  displayOrder: f.displayOrder
                }))
              : [],
            surprise: {
              title: draft.surpriseTitle || 'One Last Promise...',
              voucher: draft.surpriseVoucher || '',
              note: draft.surpriseNote || ''
            }
          }));

          setUIState((prev) => ({
            ...prev,
            giftSlug: draft.slug || ''
          }));
        }
      } catch (err) {
        console.warn('Draft hydration notice (starting fresh):', err);
        localStorage.removeItem(LOCAL_DRAFT_KEY);
      } finally {
        if (isMounted) {
          setUIState((prev) => ({ ...prev, restoringDraft: false }));
        }
      }
    }

    hydrateDraft();

    return () => {
      isMounted = false;
    };
  }, [setBuilderData, setUIState]);

  // 2. Checkpoint Save Function
  const saveDraftCheckpoint = useCallback(
    async (overrideData = null) => {
      const dataToSave = overrideData || builderData;
      if (!dataToSave) return null;

      try {
        setUIState((prev) => ({ ...prev, saving: true, errorMsg: '' }));

        const payload = {
          senderName: dataToSave.senderName,
          recipientName: dataToSave.recipientName,
          relationship: dataToSave.relationship || 'Sister',
          senderNickname: dataToSave.senderNickname,
          recipientNickname: dataToSave.recipientNickname,
          creatorEmail: dataToSave.creatorEmail,
          theme: dataToSave.theme,
          message: dataToSave.message,
          plan: dataToSave.plan,
          reasons: dataToSave.reasons,
          memories: dataToSave.memories,
          funItems: dataToSave.funItems,
          surprise: dataToSave.surprise
        };

        let result;
        if (!dataToSave.draftId) {
          result = await createDraftGift(payload);
          localStorage.setItem(LOCAL_DRAFT_KEY, result.id);
          localStorage.setItem(LOCAL_SCHEMA_VERSION_KEY, String(CURRENT_SCHEMA_VERSION));

          setBuilderData((prev) => ({
            ...prev,
            draftId: result.id,
            giftSlug: result.slug
          }));
          setUIState((prev) => ({ ...prev, giftSlug: result.slug || prev.giftSlug }));
        } else {
          result = await updateGiftDraft(dataToSave.draftId, payload);
          setUIState((prev) => ({ ...prev, giftSlug: result.slug || prev.giftSlug }));
        }

        return result;
      } catch (err) {
        console.error('Draft save failed:', err);
        setUIState((prev) => ({
          ...prev,
          errorMsg: err.message || 'Failed to sync draft progress.'
        }));
        throw err;
      } finally {
        setUIState((prev) => ({ ...prev, saving: false }));
      }
    },
    [builderData, setBuilderData, setUIState]
  );

  return { saveDraftCheckpoint };
}
